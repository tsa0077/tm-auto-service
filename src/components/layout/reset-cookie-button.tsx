"use client";

import { Button } from "@/components/ui/button";

export default function ResetCookieButton() {
  return (
    <Button
      onClick={() => {
        localStorage.removeItem("tm-cookie-consent");
        window.location.reload();
      }}
    >
      Réinitialiser le consentement cookies
    </Button>
  );
}
