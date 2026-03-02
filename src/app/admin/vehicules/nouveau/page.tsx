"use client";

import { useState } from "react";
import VehicleForm from "@/components/admin/vehicle-form";
import LeboncoinImport, { type ImportedVehicleData } from "@/components/admin/leboncoin-import";

export default function NouveauVehiculePage() {
  const [importedData, setImportedData] = useState<ImportedVehicleData | null>(null);
  const [importedImageUrls, setImportedImageUrls] = useState<string[]>([]);
  const [formKey, setFormKey] = useState(0);

  function handleImport(data: ImportedVehicleData, imageUrls: string[]) {
    setImportedData(data);
    setImportedImageUrls(imageUrls);
    // Increment key to force VehicleForm re-mount with new defaults
    setFormKey((k) => k + 1);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ajouter un véhicule</h1>
      <div className="space-y-6 max-w-4xl">
        <LeboncoinImport onImport={handleImport} />
        <VehicleForm
          key={formKey}
          initialData={importedData ? { ...importedData, features: "[]", options: "[]" } : undefined}
          importedImageUrls={importedImageUrls}
        />
      </div>
    </div>
  );
}
