import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStorageProvider } from "@/lib/storage/provider";

// ─── Leboncoin value mappings ────────────────────────────────────────

const FUEL_MAP: Record<string, string> = {
  "1": "ESSENCE",
  "2": "DIESEL",
  "3": "GPL",
  "4": "ELECTRIQUE",
  "5": "HYBRIDE",
  essence: "ESSENCE",
  diesel: "DIESEL",
  gpl: "GPL",
  electrique: "ELECTRIQUE",
  électrique: "ELECTRIQUE",
  hybride: "HYBRIDE",
};

const GEARBOX_MAP: Record<string, string> = {
  "1": "MANUELLE",
  "2": "AUTOMATIQUE",
  manuelle: "MANUELLE",
  automatique: "AUTOMATIQUE",
};

/** Normaliseleboncoin brand name to match our MAKES array */
const BRAND_MAP: Record<string, string> = {
  "mercedes-benz": "Mercedes",
  mercedes: "Mercedes",
  "vw": "Volkswagen",
  volkswagen: "Volkswagen",
  citroën: "Citroën",
  citroen: "Citroën",
  bmw: "BMW",
  audi: "Audi",
  peugeot: "Peugeot",
  renault: "Renault",
  fiat: "Fiat",
  ford: "Ford",
  honda: "Honda",
  hyundai: "Hyundai",
  kia: "Kia",
  nissan: "Nissan",
  opel: "Opel",
  seat: "Seat",
  skoda: "Skoda",
  škoda: "Skoda",
  toyota: "Toyota",
  volvo: "Volvo",
  dacia: "Dacia",
};

function normalizeBrand(raw: string): string {
  const lower = raw.toLowerCase().trim();
  return BRAND_MAP[lower] || raw; // If no mapping, keep original
}

/** Find an attribute by key in leboncoin's attributes array */
function getAttr(attributes: { key: string; value?: string; value_label?: string }[], key: string): string | undefined {
  const attr = attributes.find((a) => a.key === key);
  return attr?.value ?? attr?.value_label;
}

// ─── POST /api/admin/import-leboncoin ────────────────────────────────

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { url } = await request.json();

    if (!url || !url.includes("leboncoin.fr")) {
      return NextResponse.json({ error: "URL leboncoin invalide" }, { status: 400 });
    }

    // Fetch the listing page with browser-like headers
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Impossible de récupérer la page (erreur ${response.status})` },
        { status: 422 }
      );
    }

    const html = await response.text();

    // ── Extract __NEXT_DATA__ JSON ─────────────────────────────────
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) {
      return NextResponse.json(
        {
          error:
            "Impossible d'extraire les données. Le site a peut-être bloqué la requête. Essayez l'import manuel.",
        },
        { status: 422 }
      );
    }

    const nextData = JSON.parse(match[1]);
    const ad = nextData?.props?.pageProps?.ad;

    if (!ad) {
      return NextResponse.json(
        { error: "Données d'annonce introuvables dans la page" },
        { status: 422 }
      );
    }

    // ── Parse attributes ───────────────────────────────────────────
    const attributes = ad.attributes || [];

    const brand = normalizeBrand(getAttr(attributes, "brand") || "");
    const model = getAttr(attributes, "model") || "";
    const year = parseInt(getAttr(attributes, "regdate") || "0", 10);
    const mileage = parseInt(getAttr(attributes, "mileage") || "0", 10);
    const fuelRaw = (getAttr(attributes, "fuel") || "").toLowerCase();
    const gearboxRaw = (getAttr(attributes, "gearbox") || "").toLowerCase();
    const color = getAttr(attributes, "vehicle_color") || "";
    const doors = parseInt(getAttr(attributes, "doors") || "0", 10);
    const seats = parseInt(getAttr(attributes, "seats") || "0", 10);
    const horsePowerDin = getAttr(attributes, "horse_power_din");

    const fuel = FUEL_MAP[fuelRaw] || "DIESEL";
    const transmission = GEARBOX_MAP[gearboxRaw] || "MANUELLE";

    const vehicleData = {
      title: ad.subject || `${brand} ${model}`.trim(),
      make: brand,
      model,
      year: year || new Date().getFullYear(),
      price: ad.price?.[0] ?? null,
      mileage: mileage || null,
      fuel,
      transmission,
      power: horsePowerDin ? `${horsePowerDin}ch` : null,
      color: color || null,
      doors: doors || null,
      seats: seats || null,
      description: ad.body || "",
      type: "SALE" as const,
      status: "AVAILABLE" as const,
    };

    // ── Download & re-upload images to our storage ─────────────────
    const lbcImages: string[] = ad.images?.urls_large || ad.images?.urls || [];
    const imageUrls: string[] = [];
    const storage = getStorageProvider();

    // Limit to 10 images max
    const imagesToProcess = lbcImages.slice(0, 10);

    await Promise.all(
      imagesToProcess.map(async (imgUrl: string) => {
        try {
          const imgRes = await fetch(imgUrl);
          if (!imgRes.ok) return;
          const buffer = Buffer.from(await imgRes.arrayBuffer());
          const ct = imgRes.headers.get("content-type") || "image/jpeg";
          const ext = ct.includes("png") ? "png" : ct.includes("webp") ? "webp" : "jpg";
          const filename = `lbc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
          const blobUrl = await storage.upload(buffer, filename, ct);
          imageUrls.push(blobUrl);
        } catch (e) {
          console.error("Failed to download leboncoin image:", imgUrl, e);
        }
      })
    );

    return NextResponse.json({ data: vehicleData, imageUrls });
  } catch (err) {
    console.error("Import leboncoin error:", err);
    return NextResponse.json({ error: "Erreur lors de l'import" }, { status: 500 });
  }
}
