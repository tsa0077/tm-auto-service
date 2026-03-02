"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MAKES, FUEL_LABELS, TRANSMISSION_LABELS } from "@/content/services";
import { Search, RotateCcw } from "lucide-react";

interface VehicleFiltersProps {
  type?: "SALE" | "RENT";
}

export default function VehicleFilters({ type = "SALE" }: VehicleFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    if (type) params.set("type", type);

    const fields = ["make", "fuel", "transmission", "minPrice", "maxPrice", "yearMin", "yearMax"];
    fields.forEach((field) => {
      const val = formData.get(field) as string;
      if (val && val !== "all") params.set(field, val);
    });

    const basePath = type === "RENT" ? "/location" : "/vehicules";
    router.push(`${basePath}?${params.toString()}`);
  }

  function handleReset() {
    const basePath = type === "RENT" ? "/location" : "/vehicules";
    router.push(basePath);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Marque</Label>
        <Select name="make" defaultValue={searchParams.get("make") || "all"}>
          <SelectTrigger><SelectValue placeholder="Toutes marques" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes marques</SelectItem>
            {MAKES.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Prix min (€)</Label>
          <Input
            name="minPrice"
            type="number"
            placeholder="0"
            defaultValue={searchParams.get("minPrice") || ""}
          />
        </div>
        <div>
          <Label>Prix max (€)</Label>
          <Input
            name="maxPrice"
            type="number"
            placeholder="50000"
            defaultValue={searchParams.get("maxPrice") || ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Année min</Label>
          <Input
            name="yearMin"
            type="number"
            placeholder="2015"
            defaultValue={searchParams.get("yearMin") || ""}
          />
        </div>
        <div>
          <Label>Année max</Label>
          <Input
            name="yearMax"
            type="number"
            placeholder="2025"
            defaultValue={searchParams.get("yearMax") || ""}
          />
        </div>
      </div>

      <div>
        <Label>Carburant</Label>
        <Select name="fuel" defaultValue={searchParams.get("fuel") || "all"}>
          <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {Object.entries(FUEL_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Boîte</Label>
        <Select name="transmission" defaultValue={searchParams.get("transmission") || "all"}>
          <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {Object.entries(TRANSMISSION_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          <Search className="h-4 w-4 mr-1" />
          Appliquer
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
