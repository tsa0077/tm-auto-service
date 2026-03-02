"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, LinkIcon, AlertCircle, CheckCircle2 } from "lucide-react";

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

interface LeboncoinImportProps {
  onImport: (data: ImportedVehicleData, imageUrls: string[]) => void;
}

export default function LeboncoinImport({ onImport }: LeboncoinImportProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleImport() {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/import-leboncoin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erreur lors de l'import");
      }

      setSuccess(true);
      onImport(result.data, result.imageUrls || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'import");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Download className="h-5 w-5 text-blue-600" />
          Importer depuis Leboncoin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          Collez l&apos;URL d&apos;une annonce Leboncoin pour pré-remplir le formulaire automatiquement.
        </p>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Label htmlFor="lbc-url" className="sr-only">URL Leboncoin</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="lbc-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.leboncoin.fr/ad/voitures/..."
                className="pl-9 bg-white"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleImport();
                  }
                }}
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={handleImport}
            disabled={loading || !url.trim()}
            variant="default"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Import en cours...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Importer
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-md">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Annonce importée ! Vérifiez les données ci-dessous avant d&apos;enregistrer.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
