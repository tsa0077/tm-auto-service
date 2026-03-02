import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-red-600">
                <Image
                  src="/brand/logo.png"
                  alt="TM Auto Service"
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
              <div>
                <span className="font-bold text-lg">TM AUTO</span>
                <span className="font-light text-lg text-red-400 ml-1">SERVICE</span>
              </div>
            </div>
            <p className="text-neutral-400 text-sm">
              Garage automobile multi-marques à Quesnoy-sur-Deûle. Diagnostic, réparation,
              entretien, achat/vente, reprise et location de véhicules.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/vehicules" className="hover:text-white transition-colors">Véhicules</Link></li>
              <li><Link href="/location" className="hover:text-white transition-colors">Location</Link></li>
              <li><Link href="/reprise" className="hover:text-white transition-colors">Reprise</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/a-propos" className="hover:text-white transition-colors">À propos</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                <span>Quesnoy-sur-Deûle, 59890, France</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-500 shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+33641413489" className="hover:text-white">+33 6 41 41 34 89</a>
                  <a href="tel:+33620683903" className="hover:text-white">+33 6 20 68 39 03</a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-red-500 shrink-0" />
                <a href="mailto:contact@tm-auto-service.fr" className="hover:text-white">contact@tm-auto-service.fr</a>
              </li>
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h3 className="font-semibold mb-4">Horaires</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-500 shrink-0" />
                <div>
                  <p>Lun - Ven : 08:00 - 18:00</p>
                  <p>Samedi : 09:00 - 13:00</p>
                  <p>Dimanche : Fermé</p>
                </div>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} TM AUTO SERVICE. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-white">Politique de confidentialité</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
