import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { STATUS_LABELS, FUEL_LABELS } from "@/content/services";

async function getVehicles() {
  try {
    return await prisma.vehicle.findMany({
      include: { images: { take: 1, orderBy: { order: "asc" } }, _count: { select: { leads: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminVehiclesPage() {
  const vehicles = await getVehicles();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Véhicules ({vehicles.length})</h1>
        <Button asChild>
          <Link href="/admin/vehicules/nouveau">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Link>
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Aucun véhicule pour le moment.</p>
            <Button asChild>
              <Link href="/admin/vehicules/nouveau">Ajouter un véhicule</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v) => (
            <Card key={v.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-20 h-16 bg-neutral-100 rounded-md overflow-hidden shrink-0">
                  {v.images[0] ? (
                    <Image
                      src={v.images[0].url}
                      alt={v.title}
                      width={80}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      N/A
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm truncate">{v.title}</h3>
                    <Badge variant={v.status === "AVAILABLE" ? "success" : "secondary"} className="shrink-0">
                      {STATUS_LABELS[v.status]}
                    </Badge>
                    <Badge variant="outline" className="shrink-0">
                      {v.type === "RENT" ? "Location" : "Vente"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {v.make} {v.model} • {v.year} • {FUEL_LABELS[v.fuel]} •{" "}
                    {formatPrice(v.price)} • {v._count.leads} lead{v._count.leads !== 1 ? "s" : ""}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/vehicules/${v.id}`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
