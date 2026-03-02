import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { slug },
      include: { images: { orderBy: { order: "asc" } } },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Véhicule introuvable" }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
