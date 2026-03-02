import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || undefined;
    const make = searchParams.get("make") || undefined;
    const fuel = searchParams.get("fuel") || undefined;
    const transmission = searchParams.get("transmission") || undefined;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minYear = searchParams.get("minYear");
    const maxYear = searchParams.get("maxYear");
    const page = Number(searchParams.get("page")) || 1;
    const perPage = Number(searchParams.get("perPage")) || 12;

    const where: Record<string, unknown> = {
      status: "AVAILABLE",
    };

    if (type) where.type = type;
    if (make) where.make = make;
    if (fuel) where.fuel = fuel;
    if (transmission) where.transmission = transmission;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, unknown>).gte = Number(minPrice);
      if (maxPrice) (where.price as Record<string, unknown>).lte = Number(maxPrice);
    }
    if (minYear || maxYear) {
      where.year = {};
      if (minYear) (where.year as Record<string, unknown>).gte = Number(minYear);
      if (maxYear) (where.year as Record<string, unknown>).lte = Number(maxYear);
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where: where as never,
        include: { images: { take: 1, orderBy: { order: "asc" } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.vehicle.count({ where: where as never }),
    ]);

    return NextResponse.json({ vehicles, total, page, perPage, totalPages: Math.ceil(total / perPage) });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
