import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fuel, Gauge, Calendar, Settings2 } from "lucide-react";
import { formatPrice, formatNumber } from "@/lib/utils";
import { FUEL_LABELS, TRANSMISSION_LABELS, STATUS_LABELS } from "@/content/services";

interface VehicleCardProps {
  vehicle: {
    slug: string;
    title: string;
    make: string;
    model: string;
    year: number;
    price?: number | null;
    priceLabel?: string | null;
    mileage?: number | null;
    fuel: string;
    transmission: string;
    status: string;
    type: string;
    images: { url: string; alt: string }[];
  };
  basePath?: string;
}

export default function VehicleCard({ vehicle, basePath = "/vehicules" }: VehicleCardProps) {
  const imageUrl = vehicle.images[0]?.url;
  const isAvailable = vehicle.status === "AVAILABLE";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        {imageUrl ? (
        <Image
          src={imageUrl}
          alt={vehicle.images[0]?.alt || vehicle.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Aucune image
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge variant={isAvailable ? "success" : "secondary"}>
            {STATUS_LABELS[vehicle.status] || vehicle.status}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-base mb-1 line-clamp-1">{vehicle.title}</h3>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {vehicle.year}
          </span>
          {vehicle.mileage && (
            <span className="flex items-center gap-1">
              <Gauge className="h-3 w-3" />
              {formatNumber(vehicle.mileage)} km
            </span>
          )}
          <span className="flex items-center gap-1">
            <Fuel className="h-3 w-3" />
            {FUEL_LABELS[vehicle.fuel] || vehicle.fuel}
          </span>
          <span className="flex items-center gap-1">
            <Settings2 className="h-3 w-3" />
            {TRANSMISSION_LABELS[vehicle.transmission] || vehicle.transmission}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-red-600">
            {vehicle.priceLabel || formatPrice(vehicle.price)}
          </span>
          <Button size="sm" asChild>
            <Link href={`${basePath}/${vehicle.slug}`}>Voir détails</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
