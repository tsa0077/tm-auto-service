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

const BRAND_MAP: Record<string, string> = {
  "mercedes-benz": "Mercedes",
  mercedes: "Mercedes",
  vw: "Volkswagen",
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
  return BRAND_MAP[lower] || raw;
}

type LbcAttr = { key: string; value?: string; value_label?: string };

function getAttr(attributes: LbcAttr[], key: string): string | undefined {
  const attr = attributes.find((a) => a.key === key);
  return attr?.value ?? attr?.value_label;
}

/** Extract the numeric ad ID from various leboncoin URL formats */
function extractAdId(url: string): string | null {
  // Formats:
  //   https://www.leboncoin.fr/ad/voitures/2849123456
  //   https://www.leboncoin.fr/voitures/2849123456.htm
  //   https://www.leboncoin.fr/ad/vehicules/2849123456
  const m = url.match(/leboncoin\.fr\/(?:ad\/)?[^/]+\/(\d+)/);
  return m ? m[1] : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseAd(ad: any) {
  const attributes: LbcAttr[] = ad.attributes || [];

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
    price: Array.isArray(ad.price) ? ad.price[0] : (ad.price ?? null),
    mileage: mileage || null,
    fuel,
    transmission,
    power: horsePowerDin ? `${horsePowerDin}ch` : null,
    color: color || null,
    doors: doors || null,
    seats: seats || null,
    description: ad.body || ad.description || "",
    type: "SALE" as const,
    status: "AVAILABLE" as const,
  };

  const lbcImages: string[] =
    ad.images?.urls_large || ad.images?.urls || [];

  return { vehicleData, lbcImages };
}

// ─── Strategy 1: Leboncoin internal API ──────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchViaApi(adId: string): Promise<any | null> {
  const apiUrl = `https://api.leboncoin.fr/finder/classified/${adId}`;

  const res = await fetch(apiUrl, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Accept-Language": "fr-FR,fr;q=0.9",
      Origin: "https://www.leboncoin.fr",
      Referer: "https://www.leboncoin.fr/",
      "api_key": "ba0c2dad52b3ec",
    },
  });

  if (!res.ok) return null;
  return res.json();
}

// ─── Strategy 2: HTML scraping with __NEXT_DATA__ ────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchViaHtml(url: string): Promise<any | null> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "fr-FR,fr;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    },
    redirect: "follow",
  });

  if (!res.ok) return null;

  const html = await res.text();

  // Try __NEXT_DATA__
  const ndMatch = html.match(
    /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
  );
  if (ndMatch) {
    const nextData = JSON.parse(ndMatch[1]);
    const ad = nextData?.props?.pageProps?.ad;
    if (ad) return ad;
  }

  // Try JSON-LD
  const ldMatch = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
  );
  if (ldMatch) {
    const ld = JSON.parse(ldMatch[1]);
    if (ld["@type"] === "Product" || ld["@type"] === "Car") {
      return {
        subject: ld.name,
        body: ld.description,
        price: ld.offers?.price ? [Number(ld.offers.price)] : [],
        images: { urls_large: ld.image ? (Array.isArray(ld.image) ? ld.image : [ld.image]) : [] },
        attributes: [],
      };
    }
  }

  return null;
}

// ─── Shared: download images to our blob storage ─────────────────────

async function downloadImages(lbcImages: string[]): Promise<string[]> {
  const storage = getStorageProvider();
  const imageUrls: string[] = [];
  const imagesToProcess = lbcImages.slice(0, 10);

  await Promise.all(
    imagesToProcess.map(async (imgUrl: string) => {
      try {
        const imgRes = await fetch(imgUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Referer: "https://www.leboncoin.fr/",
          },
        });
        if (!imgRes.ok) return;
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        const ct = imgRes.headers.get("content-type") || "image/jpeg";
        const ext = ct.includes("png")
          ? "png"
          : ct.includes("webp")
            ? "webp"
            : "jpg";
        const filename = `lbc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const blobUrl = await storage.upload(buffer, filename, ct);
        imageUrls.push(blobUrl);
      } catch (e) {
        console.error("Failed to download leboncoin image:", imgUrl, e);
      }
    })
  );

  return imageUrls;
}

// ─── POST /api/admin/import-leboncoin ────────────────────────────────
// Supports two modes:
// 1. { url: "https://leboncoin.fr/..." } — server fetches the ad
// 2. { parsedData: {...}, imageUrls: [...] } — client already parsed, just download images

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();

    // ── Mode 2: Client already parsed the data ─────────────────────
    if (body.parsedData) {
      const imageUrls = await downloadImages(body.imageUrls || []);
      return NextResponse.json({ data: body.parsedData, imageUrls });
    }

    // ── Mode 1: Server fetches the URL ─────────────────────────────
    const { url } = body;

    if (!url || !url.includes("leboncoin.fr")) {
      return NextResponse.json(
        { error: "URL leboncoin invalide" },
        { status: 400 }
      );
    }

    const adId = extractAdId(url);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ad: any = null;

    // Strategy 1: Direct API call (fastest, no Cloudflare)
    if (adId) {
      try {
        ad = await fetchViaApi(adId);
      } catch {
        // Silently fall through
      }
    }

    // Strategy 2: HTML scraping fallback
    if (!ad) {
      try {
        ad = await fetchViaHtml(url);
      } catch {
        // Silently fall through
      }
    }

    if (!ad) {
      return NextResponse.json(
        {
          error:
            "Impossible de récupérer l'annonce. Leboncoin bloque les requêtes automatiques. Utilisez la méthode \"Coller les données\" comme alternative.",
        },
        { status: 422 }
      );
    }

    // ── Parse ad data ──────────────────────────────────────────────
    const { vehicleData, lbcImages } = parseAd(ad);
    const imageUrls = await downloadImages(lbcImages);

    return NextResponse.json({ data: vehicleData, imageUrls });
  } catch (err) {
    console.error("Import leboncoin error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'import" },
      { status: 500 }
    );
  }
}
