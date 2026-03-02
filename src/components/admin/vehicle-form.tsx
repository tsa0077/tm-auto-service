"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { Loader2, Save, X, GripVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { MAKES, FUEL_LABELS, TRANSMISSION_LABELS } from "@/content/services";

import { parseJsonArray } from "@/lib/utils";

export interface VehicleData {
  id?: string;
  type: string;
  status: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price?: number | null;
  priceLabel?: string | null;
  mileage?: number | null;
  fuel: string;
  transmission: string;
  power?: string | null;
  color?: string | null;
  doors?: number | null;
  seats?: number | null;
  description?: string | null;
  features: string;
  options: string;
  dailyRate?: number | null;
  weeklyRate?: number | null;
  monthlyRate?: number | null;
  deposit?: number | null;
  featured: boolean;
  images?: { id: string; url: string; alt: string }[];
}

interface VehicleFormProps {
  vehicle?: VehicleData;
  /** Pre-filled data from import (partial, no id → creation mode) */
  initialData?: Partial<VehicleData>;
  /** Image URLs already uploaded to storage (e.g. from Leboncoin import) */
  importedImageUrls?: string[];
}

export default function VehicleForm({ vehicle, initialData, importedImageUrls = [] }: VehicleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  // Ordered existing images (edit mode — keeps {id,url,alt}, user can reorder/remove)
  const [orderedExistingImages, setOrderedExistingImages] = useState(vehicle?.images || []);
  // Ordered imported images (import mode — keeps url strings, user can reorder/remove)
  const [orderedImportedUrls, setOrderedImportedUrls] = useState<string[]>(importedImageUrls);
  const isEdit = !!vehicle;

  // Drag state for reordering (separate for each list)
  const [dragExIdx, setDragExIdx] = useState<number | null>(null);
  const [dragImpIdx, setDragImpIdx] = useState<number | null>(null);

  function moveExistingImage(from: number, to: number) {
    setOrderedExistingImages((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  }

  function removeExistingImage(idx: number) {
    setOrderedExistingImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function moveImportedImage(from: number, to: number) {
    setOrderedImportedUrls((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  }

  function removeImportedImage(idx: number) {
    setOrderedImportedUrls((prev) => prev.filter((_, i) => i !== idx));
  }

  // Merge: vehicle prop (edit mode) > initialData (import mode) > defaults
  const dv = vehicle || initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const data = {
      type: formData.get("type"),
      status: formData.get("status"),
      title: formData.get("title"),
      make: formData.get("make"),
      model: formData.get("model"),
      year: Number(formData.get("year")),
      price: formData.get("price") ? Number(formData.get("price")) : null,
      priceLabel: formData.get("priceLabel") || null,
      mileage: formData.get("mileage") ? Number(formData.get("mileage")) : null,
      fuel: formData.get("fuel"),
      transmission: formData.get("transmission"),
      power: formData.get("power") || null,
      color: formData.get("color") || null,
      doors: formData.get("doors") ? Number(formData.get("doors")) : null,
      seats: formData.get("seats") ? Number(formData.get("seats")) : null,
      description: formData.get("description") || null,
      features: (formData.get("features") as string)?.split("\n").filter(Boolean) || [],
      options: (formData.get("options") as string)?.split("\n").filter(Boolean) || [],
      dailyRate: formData.get("dailyRate") ? Number(formData.get("dailyRate")) : null,
      weeklyRate: formData.get("weeklyRate") ? Number(formData.get("weeklyRate")) : null,
      monthlyRate: formData.get("monthlyRate") ? Number(formData.get("monthlyRate")) : null,
      deposit: formData.get("deposit") ? Number(formData.get("deposit")) : null,
      featured: formData.get("featured") === "on",
    };

    try {
      // Upload new file images first
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const uploadForm = new FormData();
        uploadForm.append("file", file);
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadForm,
        });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageUrls.push(url);
        }
      }

      // Include imported images in their user-defined order
      imageUrls.push(...orderedImportedUrls);

      // Compute deleted image IDs (original images removed by user)
      const originalIds = (vehicle?.images || []).map((img) => img.id);
      const keptIds = orderedExistingImages.map((img) => img.id);
      const deletedImageIds = originalIds.filter((id) => !keptIds.includes(id));

      // Compute image reorder (existing images in new order)
      const imageOrder = orderedExistingImages.map((img, i) => ({ id: img.id, order: i }));

      const url = isEdit
        ? `/api/admin/vehicles/${vehicle.id}`
        : "/api/admin/vehicles";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, newImageUrls: imageUrls, deletedImageIds, imageOrder }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur serveur");
      }

      router.push("/admin/vehicules");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Basic info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Type *</Label>
              <Select name="type" defaultValue={dv?.type || "SALE"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALE">Vente</SelectItem>
                  <SelectItem value="RENT">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Statut *</Label>
              <Select name="status" defaultValue={dv?.status || "AVAILABLE"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Disponible</SelectItem>
                  <SelectItem value="RESERVED">Réservé</SelectItem>
                  <SelectItem value="SOLD">Vendu</SelectItem>
                  <SelectItem value="RENTED">Loué</SelectItem>
                  <SelectItem value="MAINTENANCE">En maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Titre *</Label>
            <Input name="title" required defaultValue={dv?.title} placeholder="ex: Audi A3 Sportback 2.0 TDI" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Marque *</Label>
              <Select name="make" defaultValue={dv?.make || ""}>
                <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                <SelectContent>
                  {MAKES.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Modèle *</Label>
              <Input name="model" required defaultValue={dv?.model} placeholder="ex: A3" />
            </div>
            <div>
              <Label>Année *</Label>
              <Input name="year" type="number" required defaultValue={dv?.year || 2024} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Prix (€)</Label>
              <Input name="price" type="number" defaultValue={dv?.price || ""} placeholder="10990" />
            </div>
            <div>
              <Label>Libellé prix</Label>
              <Input name="priceLabel" defaultValue={dv?.priceLabel || ""} placeholder="Prix sur demande" />
            </div>
            <div>
              <Label>Kilométrage</Label>
              <Input name="mileage" type="number" defaultValue={dv?.mileage || ""} placeholder="85000" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Carburant</Label>
              <Select name="fuel" defaultValue={dv?.fuel || "DIESEL"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(FUEL_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Transmission</Label>
              <Select name="transmission" defaultValue={dv?.transmission || "MANUELLE"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TRANSMISSION_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><Label>Puissance</Label><Input name="power" defaultValue={dv?.power || ""} placeholder="150ch" /></div>
            <div><Label>Couleur</Label><Input name="color" defaultValue={dv?.color || ""} placeholder="Noir" /></div>
            <div><Label>Portes</Label><Input name="doors" type="number" defaultValue={dv?.doors || ""} /></div>
            <div><Label>Places</Label><Input name="seats" type="number" defaultValue={dv?.seats || ""} /></div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea name="description" rows={4} defaultValue={dv?.description || ""} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Caractéristiques (1 par ligne)</Label>
              <Textarea name="features" rows={4} defaultValue={parseJsonArray(dv?.features).join("\n") || ""} placeholder="GPS\nClim auto\nRadar de recul" />
            </div>
            <div>
              <Label>Options (1 par ligne)</Label>
              <Textarea name="options" rows={4} defaultValue={parseJsonArray(dv?.options).join("\n") || ""} placeholder="Pack Sport\nToit ouvrant" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch name="featured" defaultChecked={dv?.featured || false} />
            <Label>Véhicule mis en avant</Label>
          </div>
        </CardContent>
      </Card>

      {/* Rental pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Tarifs location (si type Location)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><Label>Jour (€)</Label><Input name="dailyRate" type="number" defaultValue={dv?.dailyRate || ""} /></div>
            <div><Label>Semaine (€)</Label><Input name="weeklyRate" type="number" defaultValue={dv?.weeklyRate || ""} /></div>
            <div><Label>Mois (€)</Label><Input name="monthlyRate" type="number" defaultValue={dv?.monthlyRate || ""} /></div>
            <div><Label>Caution (€)</Label><Input name="deposit" type="number" defaultValue={dv?.deposit || ""} /></div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Existing images — reorderable */}
          {orderedExistingImages.length > 0 && (
            <div className="mb-4">
              <Label className="mb-2 block text-sm text-muted-foreground">
                Images actuelles ({orderedExistingImages.length}) — glissez ou utilisez les flèches pour réorganiser
              </Label>
              <div className="flex flex-wrap gap-3">
                {orderedExistingImages.map((img, i) => {
                  const deletedCount = (vehicle?.images || []).length - orderedExistingImages.length;
                  return (
                    <div
                      key={img.id}
                      draggable
                      onDragStart={() => setDragExIdx(i)}
                      onDragOver={(e) => { e.preventDefault(); }}
                      onDrop={() => {
                        if (dragExIdx !== null && dragExIdx !== i) moveExistingImage(dragExIdx, i);
                        setDragExIdx(null);
                      }}
                      onDragEnd={() => setDragExIdx(null)}
                      className={`relative w-28 rounded-md overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                        dragExIdx === i ? "border-blue-500 opacity-50 scale-95" : "border-gray-300"
                      } ${i === 0 ? "ring-2 ring-blue-500" : ""}`}
                    >
                      {/* Position badge */}
                      <div className="absolute top-1 left-1 z-10 bg-black/70 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {i + 1}
                      </div>
                      {i === 0 && (
                        <div className="absolute top-1 left-8 z-10 bg-blue-600 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                          Principale
                        </div>
                      )}
                      {/* Grip icon */}
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-black/40 text-white rounded-r p-0.5">
                        <GripVertical className="h-3 w-3" />
                      </div>
                      {/* Image */}
                      <div className="w-28 h-24">
                        <Image src={img.url} alt={img.alt} width={112} height={96} className="w-full h-full object-cover" unoptimized />
                      </div>
                      {/* Controls bar */}
                      <div className="flex items-center justify-between bg-gray-100 px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => i > 0 && moveExistingImage(i, i - 1)}
                          disabled={i === 0}
                          className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Déplacer à gauche"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeExistingImage(i)}
                          className="p-0.5 rounded hover:bg-red-100 text-red-600"
                          title="Supprimer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => i < orderedExistingImages.length - 1 && moveExistingImage(i, i + 1)}
                          disabled={i === orderedExistingImages.length - 1}
                          className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Déplacer à droite"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {(() => {
                const deletedCount = (vehicle?.images || []).length - orderedExistingImages.length;
                return deletedCount > 0 ? (
                  <p className="text-xs text-red-600 mt-2">
                    {deletedCount} image{deletedCount > 1 ? "s" : ""} sera{deletedCount > 1 ? "ont" : ""} supprimée{deletedCount > 1 ? "s" : ""}
                  </p>
                ) : null;
              })()}
            </div>
          )}

          {/* Imported images (from Leboncoin) — reorderable */}
          {orderedImportedUrls.length > 0 && (
            <div className="mb-4">
              <Label className="mb-2 block text-sm text-muted-foreground">
                Images importées ({orderedImportedUrls.length}) — glissez ou utilisez les flèches pour réorganiser
              </Label>
              <div className="flex flex-wrap gap-3">
                {orderedImportedUrls.map((imgUrl, i) => (
                  <div
                    key={imgUrl}
                    draggable
                    onDragStart={() => setDragImpIdx(i)}
                    onDragOver={(e) => { e.preventDefault(); }}
                    onDrop={() => {
                      if (dragImpIdx !== null && dragImpIdx !== i) moveImportedImage(dragImpIdx, i);
                      setDragImpIdx(null);
                    }}
                    onDragEnd={() => setDragImpIdx(null)}
                    className={`relative w-28 rounded-md overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                      dragImpIdx === i ? "border-blue-500 opacity-50 scale-95" : "border-blue-300"
                    } ${i === 0 ? "ring-2 ring-blue-500" : ""}`}
                  >
                    {/* Position badge */}
                    <div className="absolute top-1 left-1 z-10 bg-black/70 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {i + 1}
                    </div>
                    {i === 0 && (
                      <div className="absolute top-1 left-8 z-10 bg-blue-600 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                        Principale
                      </div>
                    )}
                    {/* Grip icon */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-black/40 text-white rounded-r p-0.5">
                      <GripVertical className="h-3 w-3" />
                    </div>
                    {/* Image */}
                    <div className="w-28 h-24">
                      <Image src={imgUrl} alt={`Import ${i + 1}`} width={112} height={96} className="w-full h-full object-cover" unoptimized />
                    </div>
                    {/* Controls bar */}
                    <div className="flex items-center justify-between bg-gray-100 px-1 py-0.5">
                      <button
                        type="button"
                        onClick={() => i > 0 && moveImportedImage(i, i - 1)}
                        disabled={i === 0}
                        className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Déplacer à gauche"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImportedImage(i)}
                        className="p-0.5 rounded hover:bg-red-100 text-red-600"
                        title="Retirer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => i < orderedImportedUrls.length - 1 && moveImportedImage(i, i + 1)}
                        disabled={i === orderedImportedUrls.length - 1}
                        className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Déplacer à droite"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New file selection */}
          <div>
            <Label>Ajouter des images</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files);
                  setImageFiles(files);
                  // Generate previews
                  const previews = files.map((f) => URL.createObjectURL(f));
                  setImagePreviews((prev) => {
                    prev.forEach((url) => URL.revokeObjectURL(url));
                    return previews;
                  });
                }
              }}
              className="mt-1"
            />
          </div>

          {/* New image previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-3">
              <Label className="mb-2 block text-sm text-muted-foreground">
                Aperçu ({imagePreviews.length} fichier{imagePreviews.length > 1 ? "s" : ""})
              </Label>
              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden border group">
                    <Image src={preview} alt={`Aperçu ${i + 1}`} width={96} height={96} className="w-full h-full object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(preview);
                        setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
                        setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Retirer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer le véhicule"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
