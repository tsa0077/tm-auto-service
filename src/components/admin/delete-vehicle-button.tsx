"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteVehicleButton({ vehicleId, vehicleTitle }: { vehicleId: string; vehicleTitle: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer « ${vehicleTitle} » ?\n\nCette action est irréversible.`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur");
      router.refresh();
    } catch {
      alert("Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDelete} disabled={loading} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}
