import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RepriseForm from "@/components/forms/reprise-form";
import { generateSEO } from "@/lib/seo";
import { Check, ArrowLeftRight } from "lucide-react";

export const metadata: Metadata = generateSEO({
  title: "Reprise de véhicule | TM AUTO SERVICE",
  description:
    "Estimation gratuite de votre véhicule. Reprise immédiate au meilleur prix chez TM AUTO SERVICE.",
  url: "https://tm-auto-service.fr/reprise",
});

export default function ReprisePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <Badge className="mb-4">
          <ArrowLeftRight className="h-3 w-3 mr-1" />
          Reprise
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Faites reprendre votre véhicule</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Estimation gratuite et sans engagement. Nous reprenons votre véhicule au prix juste,
          que vous achetiez chez nous ou non.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          "Estimation gratuite en 24h",
          "Reprise immédiate",
          "Prix du marché transparent",
          "Démarches simplifiées",
          "Combinaison reprise + achat",
          "Tout véhicule accepté",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-600 shrink-0" />
            {item}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demande de reprise</CardTitle>
        </CardHeader>
        <CardContent>
          <RepriseForm />
        </CardContent>
      </Card>
    </div>
  );
}
