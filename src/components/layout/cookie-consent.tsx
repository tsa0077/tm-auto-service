"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

function getInitialShow() {
  if (typeof window === "undefined") return false;
  return !localStorage.getItem("tm-cookie-consent");
}

export default function CookieConsent() {
  const [show, setShow] = useState(getInitialShow);

  const accept = () => {
    localStorage.setItem("tm-cookie-consent", "accepted");
    setShow(false);
    // Dispatch custom event for tracking scripts to listen
    window.dispatchEvent(new Event("cookie-consent-accepted"));
  };

  const decline = () => {
    localStorage.setItem("tm-cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-2xl p-4 md:p-6">
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">🍪 Nous utilisons des cookies</h3>
          <p className="text-xs text-muted-foreground">
            Ce site utilise des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu.
            En cliquant sur &quot;Accepter&quot;, vous consentez à l&apos;utilisation de tous les cookies.{" "}
            <a href="/cookies" className="underline text-red-600">En savoir plus</a>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={decline}>
            Refuser
          </Button>
          <Button size="sm" onClick={accept}>
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
}
