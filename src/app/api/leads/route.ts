import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { leadSchema } from "@/lib/validators";
import { sendEmail, buildLeadNotificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        ...parsed.data,
        vehicleId: parsed.data.vehicleId || null,
      },
    });

    // Send email notification (non-blocking)
    try {
      const settings = await prisma.settings.findFirst();
      if (settings?.businessEmail) {
        const { subject, html } = buildLeadNotificationEmail(lead);
        await sendEmail({ to: settings.businessEmail, subject, html });
      }
    } catch {
      // Silently fail – lead is saved
      console.error("Failed to send lead notification email");
    }

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
