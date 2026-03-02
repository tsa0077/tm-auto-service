"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

interface ChatWidgetProps {
  enabled: boolean;
  provider: string;
  script: string;
  cookieConsentEnabled?: boolean;
}

export default function ChatWidget({
  enabled,
  provider,
  script,
  cookieConsentEnabled = true,
}: ChatWidgetProps) {
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

  if (!enabled || !script || !consented) return null;

  return (
    <Script
      id={`chat-${provider}`}
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
