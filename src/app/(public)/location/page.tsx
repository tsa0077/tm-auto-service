import type { Metadata } from "next";
import { Suspense } from "react";
import prisma from "@/lib/db";
import VehicleCard from "@/components/vehicles/vehicle-card";
import VehicleFilters from "@/components/vehicles/vehicle-filters";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Location de véhicules | TM AUTO SERVICE",
  description:
    "Louez un véhicule récent et entretenu chez TM AUTO SERVICE. Location courte et longue durée à tarifs compétitifs.",
  url: "https://tm-auto-service.fr/location",
});

interface Props {
  searchParams: Promise<{
    make?: string;
    fuel?: string;
    transmission?: string;
    minPrice?: string;
    maxPrice?: string;
    yearMin?: string;
    yearMax?: string;
    page?: string;
  }>;
}

async function getRentalVehicles(searchParams: {
  make?: string;
  fuel?: string;
  transmission?: string;
  minPrice?: string;
  maxPrice?: string;
  yearMin?: string;
  yearMax?: string;
  page?: string;
}) {
  const where: Record<string, unknown> = { type: "RENT" as const };

  if (searchParams.make && searchParams.make !== "all") where.make = searchParams.make;
  if (searchParams.fuel && searchParams.fuel !== "all") where.fuel = searchParams.fuel;
  if (searchParams.transmission && searchParams.transmission !== "all")
    where.transmission = searchParams.transmission;

  const yearFilter: Record<string, number> = {};
  if (searchParams.yearMin) yearFilter.gte = Number(searchParams.yearMin);
  if (searchParams.yearMax) yearFilter.lte = Number(searchParams.yearMax);
  if (Object.keys(yearFilter).length) where.year = yearFilter;

  const page = Number(searchParams.page) || 1;
  const perPage = 12;

  try {
    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.vehicle.count({ where }),
    ]);
    return { vehicles, total, page, totalPages: Math.ceil(total / perPage) };
  } catch {
    return { vehicles: [], total: 0, page: 1, totalPages: 0 };
  }
}

export default async function LocationPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { vehicles, total, totalPages, page } = await getRentalVehicles(sp);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Location de véhicules</h1>
      <p className="text-muted-foreground mb-8">
        {total} véhicule{total > 1 ? "s" : ""} disponible{total > 1 ? "s" : ""} à la location
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-20 bg-white border border-border rounded-lg p-4">
            <h2 className="font-semibold mb-4">Filtres</h2>
            <Suspense fallback={<div>Chargement...</div>}>
              <VehicleFilters type="RENT" />
            </Suspense>
          </div>
        </aside>

        <div className="flex-1">
          {vehicles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-2">Aucun véhicule disponible</p>
              <p className="text-sm text-muted-foreground">
                Revenez bientôt ou contactez-nous pour connaître nos disponibilités.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} basePath="/location" />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`/location?page=${p}`}
                      className={`px-3 py-2 rounded-md text-sm ${
                        p === page
                          ? "bg-red-600 text-white"
                          : "bg-neutral-100 hover:bg-neutral-200"
                      }`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
