"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Phone, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/vehicules", label: "Véhicules" },
  { href: "/location", label: "Location" },
  { href: "/reprise", label: "Reprise" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
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
          <div className="hidden sm:block">
            <span className="font-bold text-lg text-neutral-900">TM AUTO</span>
            <span className="font-light text-lg text-red-600 ml-1">SERVICE</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-700 hover:text-red-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="tel:+33641413489">
              <Phone className="h-4 w-4 mr-1" />
              Appeler
            </a>
          </Button>
          <Button size="sm" asChild>
            <Link href="/vehicules">
              <Car className="h-4 w-4 mr-1" />
              Nos véhicules
            </Link>
          </Button>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <nav className="flex flex-col p-4 gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-neutral-700 hover:text-red-600 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3 border-t border-border">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href="tel:+33641413489">
                  <Phone className="h-4 w-4 mr-1" />
                  Appeler
                </a>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link href="/vehicules">Véhicules</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
