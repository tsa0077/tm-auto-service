import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactForm from "@/components/forms/contact-form";
import { generateSEO } from "@/lib/seo";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = generateSEO({
  title: "Contact | TM AUTO SERVICE",
  description:
    "Contactez TM AUTO SERVICE à Quesnoy-sur-Deûle. Téléphone, email, formulaire de contact et itinéraire.",
  url: "https://tm-auto-service.fr/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Une question, un devis, une prise de rendez-vous ? N&apos;hésitez pas à nous contacter.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Adresse</h3>
                  <p className="text-sm text-muted-foreground">Quesnoy-sur-Deûle, 59890, France</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Téléphone</h3>
                  <a href="tel:+33641413489" className="text-sm text-muted-foreground hover:text-foreground">
                    +33 6 41 41 34 89
                  </a>
                  <a href="tel:+33620683903" className="text-sm text-muted-foreground hover:text-foreground">
                    +33 6 20 68 39 03
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <a href="mailto:contact@tm-auto-service.fr" className="text-sm text-muted-foreground hover:text-foreground">
                    contact@tm-auto-service.fr
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Horaires</h3>
                  <p className="text-sm text-muted-foreground">Lun - Ven : 08:00 - 18:00</p>
                  <p className="text-sm text-muted-foreground">Samedi : 09:00 - 13:00</p>
                  <p className="text-sm text-muted-foreground">Dimanche : Fermé</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button className="flex-1" size="lg" asChild>
              <a href="tel:+33641413489">
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </a>
            </Button>
            <Button variant="whatsapp" className="flex-1" size="lg" asChild>
              <a href="https://wa.me/33641413489" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </a>
            </Button>
          </div>

          {/* Google Map */}
          <div className="aspect-video rounded-lg overflow-hidden border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2524.0!2d2.9968819!3d50.7095147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47dcd58fada697e7%3A0x46fbe1d32132d6d1!2sTMAUTO!5e0!3m2!1sfr!2sfr!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="TM Auto Service - Quesnoy-sur-Deûle"
            />
          </div>
          <a
            href="https://maps.app.goo.gl/4SUJQ1GUeypgRpnR6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1 mt-1"
          >
            <MapPin className="h-4 w-4" />
            Ouvrir dans Google Maps
          </a>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Formulaire de contact</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm source="CONTACT" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
