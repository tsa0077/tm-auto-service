import prisma from "@/lib/db";
import { cache } from "react";

export const getSettings = cache(async () => {
  let settings = await prisma.settings.findUnique({
    where: { id: "singleton" },
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: { id: "singleton" },
    });
  }

  return settings;
});

export const getPublicSettings = cache(async () => {
  const s = await getSettings();
  return {
    trackingEnabled: s.trackingEnabled,
    metaPixelId: s.metaPixelId,
    ga4MeasurementId: s.ga4MeasurementId,
    gtmId: s.gtmId,
    cookieConsentEnabled: s.cookieConsentEnabled,
    whatsappEnabled: s.whatsappEnabled,
    whatsappNumber: s.whatsappNumber,
    whatsappMessage: s.whatsappMessage,
    chatEnabled: s.chatEnabled,
    chatProvider: s.chatProvider,
    chatScript: s.chatScript,
    businessName: s.businessName,
    businessPhone: s.businessPhone,
    businessEmail: s.businessEmail,
    businessAddress: s.businessAddress,
    businessCity: s.businessCity,
    businessZipCode: s.businessZipCode,
    businessHours: s.businessHours,
    businessDescription: s.businessDescription,
    googleMapsUrl: s.googleMapsUrl,
    socialFacebook: s.socialFacebook,
    socialInstagram: s.socialInstagram,
    socialGoogle: s.socialGoogle,
  };
});
