"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Loader2, CheckCircle } from "lucide-react";

interface ContactFormProps {
  source?: "CONTACT" | "VEHICLE" | "REPRISE" | "LOCATION";
  vehicleId?: string;
  vehicleTitle?: string;
  compact?: boolean;
}

export default function ContactForm({
  source = "CONTACT",
  vehicleId,
  vehicleTitle,
  compact = false,
}: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      source,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
      vehicleId: vehicleId || undefined,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de l'envoi");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mb-3" />
        <h3 className="font-semibold text-lg">Message envoyé !</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Nous vous recontacterons dans les plus brefs délais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {vehicleTitle && (
        <p className="text-sm text-muted-foreground">
          Véhicule : <strong>{vehicleTitle}</strong>
        </p>
      )}

      <div className={compact ? "grid grid-cols-2 gap-3" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}>
        <div>
          <Label htmlFor="firstName">Prénom *</Label>
          <Input id="firstName" name="firstName" required placeholder="Votre prénom" />
        </div>
        <div>
          <Label htmlFor="lastName">Nom *</Label>
          <Input id="lastName" name="lastName" required placeholder="Votre nom" />
        </div>
      </div>

      <div className={compact ? "grid grid-cols-2 gap-3" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required placeholder="votre@email.fr" />
        </div>
        <div>
          <Label htmlFor="phone">Téléphone *</Label>
          <Input id="phone" name="phone" type="tel" required placeholder="06 XX XX XX XX" />
        </div>
      </div>

      {!compact && (
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            placeholder={
              source === "VEHICLE"
                ? "Je suis intéressé par ce véhicule..."
                : "Votre message..."
            }
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        {loading ? "Envoi..." : "Envoyer"}
      </Button>
    </form>
  );
}
