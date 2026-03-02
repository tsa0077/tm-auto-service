"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Loader2, CheckCircle } from "lucide-react";

export default function RepriseForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      source: "REPRISE" as const,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
      repriseMarque: formData.get("repriseMarque") as string,
      repriseModele: formData.get("repriseModele") as string,
      repriseAnnee: Number(formData.get("repriseAnnee")) || undefined,
      repriseKm: Number(formData.get("repriseKm")) || undefined,
      repriseDetails: formData.get("repriseDetails") as string,
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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mb-3" />
        <h3 className="font-semibold text-lg">Demande envoyée !</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Nous vous recontacterons sous 24h avec une estimation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Votre véhicule</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="repriseMarque">Marque *</Label>
            <Input id="repriseMarque" name="repriseMarque" required placeholder="ex: Peugeot" />
          </div>
          <div>
            <Label htmlFor="repriseModele">Modèle *</Label>
            <Input id="repriseModele" name="repriseModele" required placeholder="ex: 308" />
          </div>
          <div>
            <Label htmlFor="repriseAnnee">Année</Label>
            <Input id="repriseAnnee" name="repriseAnnee" type="number" placeholder="ex: 2019" />
          </div>
          <div>
            <Label htmlFor="repriseKm">Kilométrage</Label>
            <Input id="repriseKm" name="repriseKm" type="number" placeholder="ex: 85000" />
          </div>
        </div>
        <div>
          <Label htmlFor="repriseDetails">Détails supplémentaires</Label>
          <Textarea
            id="repriseDetails"
            name="repriseDetails"
            rows={3}
            placeholder="Carburant, boîte de vitesses, état général, options..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Vos coordonnées</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Prénom *</Label>
            <Input id="firstName" name="firstName" required placeholder="Votre prénom" />
          </div>
          <div>
            <Label htmlFor="lastName">Nom *</Label>
            <Input id="lastName" name="lastName" required placeholder="Votre nom" />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" name="email" type="email" required placeholder="votre@email.fr" />
          </div>
          <div>
            <Label htmlFor="phone">Téléphone *</Label>
            <Input id="phone" name="phone" type="tel" required placeholder="06 XX XX XX XX" />
          </div>
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={3} placeholder="Informations complémentaires..." />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} size="lg" className="w-full">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        {loading ? "Envoi..." : "Demander une estimation gratuite"}
      </Button>
    </form>
  );
}
