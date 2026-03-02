import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Search, Wrench, Droplets, Car, ArrowLeftRight, CalendarDays } from "lucide-react";
import { SERVICES } from "@/content/services";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Nos Services | TM AUTO SERVICE",
  description:
    "Découvrez tous nos services : diagnostic électronique, réparation mécanique, entretien, achat/vente, reprise et location de véhicules.",
  url: "https://tm-auto-service.fr/services",
});

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  Wrench,
  Droplets,
  Car,
  ArrowLeftRight,
  CalendarDays,
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Nos Services</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          TM AUTO SERVICE vous accompagne dans tous vos besoins automobiles, du diagnostic à la location.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((service) => {
          const IconComp = ICON_MAP[service.icon] || Wrench;
          return (
            <Link key={service.slug} href={`/services/${service.slug}`} className="group">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-lg bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                    <IconComp className="h-7 w-7 text-red-600" />
                  </div>
                  <h2 className="font-semibold text-xl mb-3">{service.title}</h2>
                  <p className="text-muted-foreground mb-4">{service.shortDescription}</p>
                  <ul className="space-y-2 mb-4">
                    {service.features.slice(0, 3).map((f) => (
                      <li key={f} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <span className="text-sm font-medium text-red-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    En savoir plus <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
