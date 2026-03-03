import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await request.json();
    const { newImageUrls, deletedImageIds, imageOrder, ...data } = body;

    // Generate unique slug
    let slug = slugify(`${data.make}-${data.model}-${data.year}`);
    const existing = await prisma.vehicle.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        ...data,
        slug,
        features: JSON.stringify(data.features || []),
        options: JSON.stringify(data.options || []),
        images: newImageUrls?.length
          ? {
              create: newImageUrls.map((url: string, i: number) => ({
                url,
                alt: data.title,
                order: i,
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (err) {
    console.error("Create vehicle error:", err);
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
