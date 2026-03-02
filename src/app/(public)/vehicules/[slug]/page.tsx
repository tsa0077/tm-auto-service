import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleGallery from "@/components/vehicles/vehicle-gallery";
import ContactForm from "@/components/forms/contact-form";
import VehicleCard from "@/components/vehicles/vehicle-card";
import { formatPrice, formatNumber, parseJsonArray } from "@/lib/utils";
import { FUEL_LABELS, TRANSMISSION_LABELS, STATUS_LABELS } from "@/content/services";
import { vehicleSchema, generateSEO } from "@/lib/seo";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  Palette,
  DoorOpen,
  Users,
  Zap,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getVehicle(slug: string) {
  try {
    return await prisma.vehicle.findUnique({
      where: { slug },
      include: { images: { orderBy: { order: "asc" } } },
    });
  } catch {
    return null;
  }
}

async function getSimilar(vehicleId: string, make: string) {
  try {
    return await prisma.vehicle.findMany({
      where: { type: "SALE", status: "AVAILABLE", make, id: { not: vehicleId } },
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      take: 3,
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);
  if (!vehicle) return {};
  return generateSEO({
    title: `${vehicle.title} | TM AUTO SERVICE`,
    description: `${vehicle.title} - ${vehicle.year} - ${formatPrice(vehicle.price)} - ${FUEL_LABELS[vehicle.fuel]} - ${formatNumber(vehicle.mileage || 0)} km`,
    url: `https://tm-auto-service.fr/vehicules/${slug}`,
    image: vehicle.images[0]?.url,
  });
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);
  if (!vehicle) notFound();

  const similar = await getSimilar(vehicle.id, vehicle.make);
  const schema = vehicleSchema(vehicle);
  const features = parseJsonArray(vehicle.features);
  const options = parseJsonArray(vehicle.options);

  const specs = [
    { label: "Année", value: vehicle.year, icon: Calendar },
    { label: "Kilométrage", value: vehicle.mileage ? `${formatNumber(vehicle.mileage)} km` : "-", icon: Gauge },
    { label: "Carburant", value: FUEL_LABELS[vehicle.fuel], icon: Fuel },
    { label: "Boîte", value: TRANSMISSION_LABELS[vehicle.transmission], icon: Settings2 },
    { label: "Puissance", value: vehicle.power || "-", icon: Zap },
    { label: "Couleur", value: vehicle.color || "-", icon: Palette },
    { label: "Portes", value: vehicle.doors || "-", icon: DoorOpen },
    { label: "Places", value: vehicle.seats || "-", icon: Users },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Link
          href="/vehicules"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux véhicules
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Gallery - 3 cols */}
          <div className="lg:col-span-3">
            <VehicleGallery images={vehicle.images} />
          </div>

          {/* Info panel - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Badge variant={vehicle.status === "AVAILABLE" ? "success" : "secondary"} className="mb-2">
                {STATUS_LABELS[vehicle.status]}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{vehicle.title}</h1>
              <p className="text-3xl font-bold text-red-600">
                {vehicle.priceLabel || formatPrice(vehicle.price)}
              </p>
            </div>

            {/* Key specs */}
            <div className="grid grid-cols-2 gap-3">
              {specs.slice(0, 4).map((spec) => (
                <div key={spec.label} className="flex items-center gap-2 text-sm">
                  <spec.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{spec.label}:</span>
                  <span className="font-medium">{String(spec.value)}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" asChild>
                <a href="tel:+33641413489">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </a>
              </Button>
              <Button size="lg" variant="whatsapp" className="flex-1" asChild>
                <a
                  href={`https://wa.me/33641413489?text=${encodeURIComponent(`Bonjour, je suis intéressé par ${vehicle.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>

            {/* Mini contact form */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Demande d&apos;information</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm
                  source="VEHICLE"
                  vehicleId={vehicle.id}
                  vehicleTitle={vehicle.title}
                  compact
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Caractéristiques</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <div className="prose max-w-none">
                {vehicle.description ? (
                  <p>{vehicle.description}</p>
                ) : (
                  <p className="text-muted-foreground">Pas de description disponible.</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="specs" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specs.map((spec) => (
                  <Card key={spec.label}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <spec.icon className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">{spec.label}</p>
                        <p className="font-medium text-sm">{String(spec.value)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="options" className="mt-4">
              {options.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {options.map((opt) => (
                    <Badge key={opt} variant="outline">{opt}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune option listée.</p>
              )}
            </TabsContent>
            <TabsContent value="conditions" className="mt-4">
              <div className="prose max-w-none text-sm text-muted-foreground">
                <p>
                  Véhicule visible sur rendez-vous au garage TM AUTO SERVICE. Garantie
                  incluse selon les conditions du vendeur. Financement possible sur demande.
                  Reprise de votre ancien véhicule possible.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar vehicles */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Véhicules similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
