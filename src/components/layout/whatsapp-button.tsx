"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  number: string;
  message?: string;
}

export default function WhatsAppButton({ number, message = "Bonjour TM AUTO SERVICE" }: WhatsAppButtonProps) {
  const url = `https://wa.me/${number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-50 md:bottom-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-all hover:scale-110"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
