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

    const lead = await prisma.lead.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(lead);
  } catch (err) {
    console.error("Update lead error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
