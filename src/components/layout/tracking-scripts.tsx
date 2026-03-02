"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

interface TrackingScriptsProps {
  metaPixelId?: string;
  ga4MeasurementId?: string;
  gtmId?: string;
  trackingEnabled?: boolean;
  cookieConsentEnabled?: boolean;
}

export default function TrackingScripts({
  metaPixelId,
  ga4MeasurementId,
  gtmId,
  trackingEnabled = false,
  cookieConsentEnabled = true,
}: TrackingScriptsProps) {
  const [consented, setConsented] = useState(() => {
    if (!cookieConsentEnabled) return true;
    if (typeof window === "undefined") return false;
    return localStorage.getItem("tm-cookie-consent") === "accepted";
  });

  useEffect(() => {
    if (!cookieConsentEnabled || consented) return;

    const handler = () => setConsented(true);
    window.addEventListener("cookie-consent-accepted", handler);
    return () => window.removeEventListener("cookie-consent-accepted", handler);
  }, [cookieConsentEnabled, consented]);

  if (!trackingEnabled || !consented) return null;

  return (
    <>
      {/* Google Tag Manager */}
      {gtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}

      {/* Google Analytics 4 */}
      {ga4MeasurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga4MeasurementId}');`}
          </Script>
        </>
      )}

      {/* Meta Pixel */}
      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${metaPixelId}');
          fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  );
}
