import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import StickyCTA from "@/components/layout/sticky-cta";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import CookieConsent from "@/components/layout/cookie-consent";
import TrackingScripts from "@/components/layout/tracking-scripts";
import ChatWidget from "@/components/layout/chat-widget";
import { getPublicSettings } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    settings = await getPublicSettings();
  } catch {
    // DB not available yet — render without settings
  }

  return (
    <>
      {settings && (
        <TrackingScripts
          metaPixelId={settings.metaPixelId}
          ga4MeasurementId={settings.ga4MeasurementId}
          gtmId={settings.gtmId}
          trackingEnabled={settings.trackingEnabled}
          cookieConsentEnabled={settings.cookieConsentEnabled}
        />
      )}
      <Header />
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <Footer />
      <StickyCTA />
      {settings?.whatsappEnabled && settings.whatsappNumber && (
        <WhatsAppButton
          number={settings.whatsappNumber}
          message={settings.whatsappMessage}
        />
      )}
      {settings && (
        <ChatWidget
          enabled={settings.chatEnabled}
          provider={settings.chatProvider}
          script={settings.chatScript}
          cookieConsentEnabled={settings.cookieConsentEnabled}
        />
      )}
      {(settings?.cookieConsentEnabled ?? true) && <CookieConsent />}
    </>
  );
}
