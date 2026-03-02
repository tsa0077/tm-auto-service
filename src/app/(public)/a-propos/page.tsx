import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateSEO } from "@/lib/seo";
import { Shield, Clock, Car, Wrench, Users, Award } from "lucide-react";

export const metadata: Metadata = generateSEO({
  title: "À propos | TM AUTO SERVICE",
  description:
    "Découvrez TM AUTO SERVICE, votre garage automobile multi-marques de confiance à Quesnoy-sur-Deûle.",
  url: "https://tm-auto-service.fr/a-propos",
});

export default function AProposPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <Badge className="mb-4">À propos</Badge>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">TM AUTO SERVICE</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Votre partenaire automobile de confiance depuis plus de 10 ans à Quesnoy-sur-Deûle.
        </p>
      </div>

      <div className="prose max-w-none mb-12">
        <p className="text-lg">
          TM AUTO SERVICE est un garage automobile multi-marques situé à Quesnoy-sur-Deûle,
          dans le département du Nord. Fondé par une équipe passionnée d&apos;automobile, notre
          garage propose une gamme complète de services pour répondre à tous vos besoins.
        </p>
        <p>
          De la réparation mécanique au diagnostic électronique, en passant par l&apos;achat/vente
          de véhicules d&apos;occasion, la reprise et la location, nous mettons notre expertise
          au service de votre satisfaction.
        </p>
        <p>
          Notre engagement : transparence, qualité et rapidité. Chaque véhicule est traité avec
          le plus grand soin, et chaque client bénéficie d&apos;un service personnalisé et
          professionnel.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: Shield,
            title: "Confiance",
            description: "Transparence totale sur les devis et les interventions. Aucune surprise.",
          },
          {
            icon: Clock,
            title: "Réactivité",
            description: "Diagnostic rapide et interventions dans les meilleurs délais.",
          },
          {
            icon: Car,
            title: "Multi-marques",
            description: "Intervention sur toutes les marques et tous les types de véhicules.",
          },
          {
            icon: Wrench,
            title: "Expertise",
            description: "Outils de dernière génération et pièces de qualité.",
          },
          {
            icon: Users,
            title: "Service client",
            description: "Équipe à l'écoute et conseils personnalisés.",
          },
          {
            icon: Award,
            title: "Garantie",
            description: "Tous nos véhicules en vente sont garantis.",
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="p-6">
              <item.icon className="h-8 w-8 text-red-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
