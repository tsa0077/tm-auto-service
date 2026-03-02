"use client";

import { Phone, MessageCircle } from "lucide-react";

export default function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-border shadow-lg">
      <div className="flex">
        <a
          href="tel:+33XXXXXXXXX"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
        >
          <Phone className="h-4 w-4" />
          Appeler
        </a>
        <a
          href="https://wa.me/33XXXXXXXXX?text=Bonjour%20TM%20AUTO%20SERVICE"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
