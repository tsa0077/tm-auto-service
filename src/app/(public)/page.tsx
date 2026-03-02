import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BrandLogos from "@/components/home/brand-logos";
import {
  Phone,
  MessageCircle,
  MapPin,
  ArrowRight,
  Shield,
  Clock,
  Wrench,
  Star,
  Search,
  Car,
  ArrowLeftRight,
  CalendarDays,
  Droplets,
} from "lucide-react";
import { SERVICES, HERO_CONTENT, WHY_US, TRUST_BADGES } from "@/content/services";
import prisma from "@/lib/db";
import VehicleCard from "@/components/vehicles/vehicle-card";
import { localBusinessSchema } from "@/lib/seo";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  Wrench,
  Droplets,
  Car,
  ArrowLeftRight,
  CalendarDays,
};

async function getRecentVehicles() {
  try {
    return await prisma.vehicle.findMany({
      where: { type: "SALE", status: "AVAILABLE" },
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { publishedAt: "desc" },
      take: 6,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const vehicles = await getRecentVehicles();
  const schema = localBusinessSchema({});

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* HERO */}
      <section className="relative bg-neutral-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/95 to-neutral-900/80" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left — Text */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {HERO_CONTENT.title}
              </h1>
              <p className="text-xl md:text-2xl text-neutral-300 mb-6">
                {HERO_CONTENT.subtitle}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {HERO_CONTENT.badges.map((badge) => (
                  <Badge key={badge} variant="outline" className="border-red-500 text-red-400 text-sm px-3 py-1">
                    {badge}
                  </Badge>
                ))}
              </div>
              <p className="text-neutral-400 max-w-2xl mb-8 text-base">
                {HERO_CONTENT.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="xl" asChild>
                  <a href="tel:+33641413489">
                    <Phone className="h-5 w-5 mr-2" />
                    Appeler
                  </a>
                </Button>
                <Button size="xl" variant="whatsapp" asChild>
                  <a href="https://wa.me/33641413489" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                <Button size="xl" variant="outline" className="border-neutral-400 text-neutral-900 bg-white hover:bg-neutral-100" asChild>
                  <a href="https://maps.app.goo.gl/4SUJQ1GUeypgRpnR6" target="_blank" rel="noopener noreferrer">
                    <MapPin className="h-5 w-5 mr-2" />
                    Itinéraire
                  </a>
                </Button>
              </div>
            </div>

            {/* Right — Image */}
            <div className="flex-shrink-0 w-80 lg:w-[480px]">
              <Image
                src="/auto-repair-team.png"
                alt="Équipe TM Auto Service"
                width={480}
                height={480}
                className="w-full h-auto drop-shadow-2xl"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="bg-red-600 text-white py-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label}>
                <p className="text-3xl font-bold">{badge.value}</p>
                <p className="text-sm text-red-100">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND LOGOS SLIDER */}
      <BrandLogos />

      {/* SERVICES */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              De la réparation mécanique au diagnostic électronique, nous couvrons tous vos besoins automobiles.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => {
              const IconComp = ICON_MAP[service.icon] || Wrench;
              return (
                <Card key={service.slug} className="hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                      <IconComp className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.shortDescription}</p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-sm font-medium text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                    >
                      En savoir plus <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* VEHICULES RECENTS */}
      {vehicles.length > 0 && (
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Véhicules récents</h2>
                <p className="text-muted-foreground">Découvrez nos dernières arrivées</p>
              </div>
              <Button variant="outline" asChild className="hidden md:flex">
                <Link href="/vehicules">
                  Voir tous les véhicules <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Button asChild>
                <Link href="/vehicules">Voir tous les véhicules</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* LOCATION */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Location</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Location de véhicules
              </h2>
              <p className="text-muted-foreground mb-6">
                Besoin d&apos;un véhicule pour quelques jours ou plusieurs mois ? Découvrez notre
                flotte de véhicules récents et bien entretenus à des tarifs compétitifs.
              </p>
              <ul className="space-y-3 mb-8">
                {["Location courte et longue durée", "Véhicules récents et entretenus", "Assurance incluse", "Tarifs compétitifs"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-red-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" asChild>
                <Link href="/location">
                  Voir la location <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="aspect-[4/3] bg-neutral-100 rounded-lg flex items-center justify-center text-muted-foreground">
              <CalendarDays className="h-24 w-24 text-neutral-300" />
            </div>
          </div>
        </div>
      </section>

      {/* AVIS */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce que disent nos clients</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            La satisfaction de nos clients est notre meilleure publicité.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: "Jean D.",
                text: "Service impeccable, diagnostic rapide et réparation de qualité. Je recommande vivement !",
                stars: 5,
              },
              {
                name: "Marie L.",
                text: "Très satisfaite de l'achat de ma voiture. Véhicule en parfait état, équipe professionnelle.",
                stars: 5,
              },
              {
                name: "Pierre M.",
                text: "Garage sérieux et transparent. Les prix sont justes et le travail est bien fait.",
                stars: 5,
              },
            ].map((review) => (
              <Card key={review.name}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: review.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">&quot;{review.text}&quot;</p>
                  <p className="font-medium text-sm">{review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="outline" asChild>
            <a href="https://g.page/review" target="_blank" rel="noopener noreferrer">
              <Star className="h-4 w-4 mr-1" />
              Laisser un avis
            </a>
          </Button>
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Pourquoi choisir TM AUTO SERVICE ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_US.map((item, i) => {
              const icons = [Clock, Shield, Car, Wrench];
              const Icon = icons[i] || Shield;
              return (
                <div key={item.title} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
