import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VehicleGallery from "@/components/vehicles/vehicle-gallery";
import ContactForm from "@/components/forms/contact-form";
import { formatPrice, formatNumber } from "@/lib/utils";
import { FUEL_LABELS, TRANSMISSION_LABELS, STATUS_LABELS } from "@/content/services";
import { generateSEO } from "@/lib/seo";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Calendar,
  Gauge,
  Fuel,
  Settings2,
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);
  if (!vehicle) return {};
  return generateSEO({
    title: `Location ${vehicle.title} | TM AUTO SERVICE`,
    description: `Louez ${vehicle.title} - ${vehicle.year} - À partir de ${formatPrice(vehicle.dailyRate)}/jour`,
    url: `https://tm-auto-service.fr/location/${slug}`,
    image: vehicle.images[0]?.url,
  });
}

export default async function LocationDetailPage({ params }: Props) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);
  if (!vehicle) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/location"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à la location
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <VehicleGallery images={vehicle.images} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <Badge variant={vehicle.status === "AVAILABLE" ? "success" : "secondary"} className="mb-2">
              {STATUS_LABELS[vehicle.status]}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{vehicle.title}</h1>
          </div>

          {/* Tarifs location */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold">Tarifs de location</h3>
              {vehicle.dailyRate && (
                <div className="flex justify-between text-sm">
                  <span>Par jour</span>
                  <span className="font-bold">{formatPrice(vehicle.dailyRate)}</span>
                </div>
              )}
              {vehicle.weeklyRate && (
                <div className="flex justify-between text-sm">
                  <span>Par semaine</span>
                  <span className="font-bold">{formatPrice(vehicle.weeklyRate)}</span>
                </div>
              )}
              {vehicle.monthlyRate && (
                <div className="flex justify-between text-sm">
                  <span>Par mois</span>
                  <span className="font-bold">{formatPrice(vehicle.monthlyRate)}</span>
                </div>
              )}
              {vehicle.deposit && (
                <div className="flex justify-between text-sm border-t pt-2">
                  <span>Caution</span>
                  <span className="font-medium">{formatPrice(vehicle.deposit)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key specs */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Année", value: vehicle.year, icon: Calendar },
              { label: "Kilométrage", value: vehicle.mileage ? `${formatNumber(vehicle.mileage)} km` : "-", icon: Gauge },
              { label: "Carburant", value: FUEL_LABELS[vehicle.fuel], icon: Fuel },
              { label: "Boîte", value: TRANSMISSION_LABELS[vehicle.transmission], icon: Settings2 },
            ].map((spec) => (
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
                href={`https://wa.me/33641413489?text=${encodeURIComponent(`Bonjour, je souhaite louer ${vehicle.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </a>
            </Button>
          </div>

          {/* Contact form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Réserver ce véhicule</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm
                source="LOCATION"
                vehicleId={vehicle.id}
                vehicleTitle={vehicle.title}
                compact
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {vehicle.description && (
        <div className="mt-10 prose max-w-none">
          <h2>Description</h2>
          <p>{vehicle.description}</p>
        </div>
      )}
    </div>
  );
}
