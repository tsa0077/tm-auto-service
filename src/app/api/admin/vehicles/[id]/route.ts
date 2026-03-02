import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await props.params;
    const body = await request.json();
    const { newImageUrls, deletedImageIds, ...data } = body;

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...data,
        features: data.features ? JSON.stringify(data.features) : undefined,
        options: data.options ? JSON.stringify(data.options) : undefined,
      },
    });

    // Delete removed images
    if (deletedImageIds?.length) {
      await prisma.vehicleImage.deleteMany({
        where: { id: { in: deletedImageIds }, vehicleId: id },
      });
    }

    // Add new images
    if (newImageUrls?.length) {
      const maxPos = await prisma.vehicleImage.aggregate({
        where: { vehicleId: id },
        _max: { order: true },
      });
      const startPos = (maxPos._max.order ?? -1) + 1;

      await prisma.vehicleImage.createMany({
        data: newImageUrls.map((url: string, i: number) => ({
          vehicleId: id,
          url,
          alt: vehicle.title,
          order: startPos + i,
        })),
      });
    }

    return NextResponse.json(vehicle);
  } catch (err) {
    console.error("Update vehicle error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await props.params;

    // Delete images first
    await prisma.vehicleImage.deleteMany({ where: { vehicleId: id } });
    await prisma.vehicle.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete vehicle error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
