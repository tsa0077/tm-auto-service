"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Download,
  AlertCircle,
  CheckCircle2,
  ClipboardPaste,
  Copy,
} from "lucide-react";

export interface ImportedVehicleData {
  title: string;
  make: string;
  model: string;
  year: number;
  price: number | null;
  mileage: number | null;
  fuel: string;
  transmission: string;
  power: string | null;
  color: string | null;
  doors: number | null;
  seats: number | null;
  description: string;
  type: string;
  status: string;
}

// ─── Mappings (same as server) ───────────────────────────────────────

const FUEL_MAP: Record<string, string> = {
  "1": "ESSENCE", "2": "DIESEL", "3": "GPL", "4": "ELECTRIQUE", "5": "HYBRIDE",
  essence: "ESSENCE", diesel: "DIESEL", gpl: "GPL",
  electrique: "ELECTRIQUE", électrique: "ELECTRIQUE", hybride: "HYBRIDE",
};

const GEARBOX_MAP: Record<string, string> = {
  "1": "MANUELLE", "2": "AUTOMATIQUE",
  manuelle: "MANUELLE", automatique: "AUTOMATIQUE",
};

const BRAND_MAP: Record<string, string> = {
  "mercedes-benz": "Mercedes", mercedes: "Mercedes",
  vw: "Volkswagen", volkswagen: "Volkswagen",
  citroën: "Citroën", citroen: "Citroën",
  bmw: "BMW", audi: "Audi", peugeot: "Peugeot", renault: "Renault",
  fiat: "Fiat", ford: "Ford", honda: "Honda", hyundai: "Hyundai",
  kia: "Kia", nissan: "Nissan", opel: "Opel", seat: "Seat",
  skoda: "Skoda", škoda: "Skoda", toyota: "Toyota", volvo: "Volvo", dacia: "Dacia",
};

type LbcAttr = { key: string; value?: string; value_label?: string };

function getAttr(attrs: LbcAttr[], key: string) {
  const a = attrs.find((x) => x.key === key);
  return a?.value ?? a?.value_label ?? "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseAdJson(ad: any): { data: ImportedVehicleData; imageUrls: string[] } {
  const attrs: LbcAttr[] = ad.attributes || [];
  const brandRaw = getAttr(attrs, "brand");
  const brand = BRAND_MAP[brandRaw.toLowerCase().trim()] || brandRaw;
  const model = getAttr(attrs, "model");
  const fuelRaw = getAttr(attrs, "fuel").toLowerCase();
  const gearRaw = getAttr(attrs, "gearbox").toLowerCase();

  return {
    data: {
      title: ad.subject || `${brand} ${model}`.trim(),
      make: brand,
      model,
      year: parseInt(getAttr(attrs, "regdate"), 10) || new Date().getFullYear(),
      price: Array.isArray(ad.price) ? ad.price[0] : (ad.price ?? null),
      mileage: parseInt(getAttr(attrs, "mileage"), 10) || null,
      fuel: FUEL_MAP[fuelRaw] || "DIESEL",
      transmission: GEARBOX_MAP[gearRaw] || "MANUELLE",
      power: getAttr(attrs, "horse_power_din") ? `${getAttr(attrs, "horse_power_din")}ch` : null,
      color: getAttr(attrs, "vehicle_color") || null,
      doors: parseInt(getAttr(attrs, "doors"), 10) || null,
      seats: parseInt(getAttr(attrs, "seats"), 10) || null,
      description: ad.body || ad.description || "",
      type: "SALE",
      status: "AVAILABLE",
    },
    imageUrls: ad.images?.urls_large || ad.images?.urls || [],
  };
}

// ─── Bookmarklet: one click on Leboncoin page copies the ad data ────

const CONSOLE_SCRIPT = `copy(JSON.stringify(__NEXT_DATA__.props.pageProps.ad))`;

const BOOKMARKLET_CODE = `javascript:void(function(){try{var d=__NEXT_DATA__.props.pageProps.ad;if(!d){alert('Aucune annonce trouvée sur cette page.');return;}var j=JSON.stringify(d);navigator.clipboard.writeText(j).then(function(){alert('Données copiées ! Retournez sur TM AUTO et collez (Ctrl+V).');}).catch(function(){prompt('Copiez manuellement (Ctrl+A puis Ctrl+C):',j);});}catch(e){alert('Ouvrez cette page sur une annonce Leboncoin.');}})()`;

interface LeboncoinImportProps {
  onImport: (data: ImportedVehicleData, imageUrls: string[]) => void;
}

export default function LeboncoinImport({ onImport }: LeboncoinImportProps) {
  const [pastedJson, setPastedJson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Paste import (client-side parsing, then server for images) ───
  async function handlePasteImport() {
    if (!pastedJson.trim()) return;
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Try parsing as raw ad JSON
      let adJson;
      const trimmed = pastedJson.trim();

      try {
        const parsed = JSON.parse(trimmed);
        // Check if it's the full __NEXT_DATA__ or just the ad object
        if (parsed?.props?.pageProps?.ad) {
          adJson = parsed.props.pageProps.ad;
        } else if (parsed?.subject || parsed?.attributes) {
          adJson = parsed;
        } else {
          throw new Error("Format non reconnu");
        }
      } catch {
        // Maybe it's HTML — try extracting __NEXT_DATA__
        const match = trimmed.match(
          /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
        );
        if (match) {
          const nd = JSON.parse(match[1]);
          adJson = nd?.props?.pageProps?.ad;
        }
        if (!adJson) {
          throw new Error(
            "Données invalides. Collez le JSON copié depuis la console du navigateur (voir instructions)."
          );
        }
      }

      const { data, imageUrls: lbcImageUrls } = parseAdJson(adJson);

      // Send image URLs to server for download & re-upload to our storage
      const res = await fetch("/api/admin/import-leboncoin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrls: lbcImageUrls, parsedData: data }),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Erreur");

      setSuccess(true);
      onImport(data, result.imageUrls || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'import");
    } finally {
      setLoading(false);
    }
  }

  function copyScript() {
    navigator.clipboard.writeText(CONSOLE_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Download className="h-5 w-5 text-blue-600" />
          Importer depuis Leboncoin
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ── Method 1: Bookmarklet (easiest) ─────────────────── */}
        <div className="bg-white border rounded-lg p-4 space-y-3">
          <p className="text-sm font-semibold flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">1</span>
            Méthode rapide — Glissez ce bouton dans votre barre de favoris :
          </p>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              href={BOOKMARKLET_CODE}
              onClick={(e) => e.preventDefault()}
              draggable
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm px-4 py-2 rounded-lg cursor-grab active:cursor-grabbing shadow-sm select-none"
              title="Glissez-moi dans votre barre de favoris !"
            >
              <Download className="h-4 w-4" />
              📋 Copier annonce LBC
            </a>
            <span className="text-xs text-muted-foreground">← Glissez vers votre barre de favoris</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Ensuite, sur une page Leboncoin, cliquez sur ce favori → les données sont copiées → revenez ici et collez.
          </p>
        </div>

        {/* ── Method 2: Console command (alternative) ─────────── */}
        <details className="bg-white border rounded-lg">
          <summary className="p-4 cursor-pointer text-sm font-semibold flex items-center gap-2">
            <span className="bg-gray-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">2</span>
            Méthode alternative — Commande console
          </summary>
          <div className="px-4 pb-4 space-y-2">
            <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>Ouvrez l&apos;annonce Leboncoin</li>
              <li>Appuyez sur <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-xs font-mono">F12</kbd> → onglet <strong>Console</strong></li>
              <li className="flex flex-col gap-1.5">
                <span>Collez cette commande et appuyez sur Entrée :</span>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-gray-900 text-green-400 px-3 py-2 rounded font-mono select-all">
                    {CONSOLE_SCRIPT}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyScript}
                    className="shrink-0"
                  >
                    {copied ? (
                      <><CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-600" />Copié !</>
                    ) : (
                      <><Copy className="h-3.5 w-3.5 mr-1" />Copier</>
                    )}
                  </Button>
                </div>
              </li>
              <li>Revenez ici et collez le résultat ci-dessous</li>
            </ol>
          </div>
        </details>

        {/* ── Paste area ────────────────────────────────────────── */}
        <div>
          <Label htmlFor="lbc-json" className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">→</span>
            Collez les données ici (Ctrl+V)
          </Label>
          <Textarea
            id="lbc-json"
            value={pastedJson}
            onChange={(e) => setPastedJson(e.target.value)}
            placeholder='Collez ici le JSON copié depuis Leboncoin...'
            rows={5}
            className="mt-1 bg-white font-mono text-xs"
            disabled={loading}
          />
        </div>

        <Button
          type="button"
          onClick={handlePasteImport}
          disabled={loading || !pastedJson.trim()}
          className="w-full"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" />Traitement...</>
          ) : (
            <><ClipboardPaste className="h-4 w-4 mr-2" />Importer les données</>
          )}
        </Button>

        {/* ── Messages ──────────────────────────────────────────── */}
        {error && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md whitespace-pre-line">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-md">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Annonce importée ! Vérifiez les données ci-dessous avant d&apos;enregistrer.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
