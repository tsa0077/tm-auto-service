import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, MessageCircle, Check } from "lucide-react";
import { SERVICES, getServiceBySlug } from "@/content/services";
import { generateSEO } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return generateSEO({
    title: `${service.title} | TM AUTO SERVICE`,
    description: service.shortDescription,
    url: `https://tm-auto-service.fr/services/${slug}`,
  });
}

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/services"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux services
      </Link>

      <Badge className="mb-4">Service</Badge>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h1>
      <p className="text-lg text-muted-foreground mb-8">{service.description}</p>

      {/* Features */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="font-semibold text-xl mb-4">Ce que nous proposons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.features.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      {service.faq.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold text-xl mb-4">Questions fréquentes</h2>
          <div className="space-y-4">
            {service.faq.map((item) => (
              <Card key={item.question}>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{item.question}</h3>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <Card className="bg-neutral-900 text-white">
        <CardContent className="p-6 md:p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Besoin de ce service ?</h2>
          <p className="text-neutral-400 mb-6">
            Contactez-nous dès maintenant pour un devis gratuit.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <a href="tel:+33641413489">
                <Phone className="h-5 w-5 mr-2" />
                Appeler
              </a>
            </Button>
            <Button size="lg" variant="whatsapp" asChild>
              <a href="https://wa.me/33641413489" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-neutral-400 text-neutral-900 bg-white hover:bg-neutral-100" asChild>
              <Link href="/contact">Formulaire de contact</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
