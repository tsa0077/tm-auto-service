import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({ data: {} });
    }
    // Return only public-safe fields
    return NextResponse.json({
      metaPixelId: settings.metaPixelId,
      ga4MeasurementId: settings.ga4MeasurementId,
      gtmId: settings.gtmId,
      whatsappNumber: settings.whatsappNumber,
      whatsappMessage: settings.whatsappMessage,
      whatsappEnabled: settings.whatsappEnabled,
      chatProvider: settings.chatProvider,
      chatScript: settings.chatScript,
      chatEnabled: settings.chatEnabled,
      businessName: settings.businessName,
      businessAddress: settings.businessAddress,
      businessPhone: settings.businessPhone,
      businessEmail: settings.businessEmail,
      businessHours: settings.businessHours,
      businessDescription: settings.businessDescription,
      googleMapsUrl: settings.googleMapsUrl,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
