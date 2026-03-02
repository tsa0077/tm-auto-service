export interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
}

export function generateSEO({
  title,
  description,
  url = "https://tm-auto-service.fr",
  image = "/brand/og-image.jpg",
  type = "website",
}: SEOProps) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "TM AUTO SERVICE",
      images: [{ url: image, width: 1200, height: 630 }],
      locale: "fr_FR",
      type,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export function localBusinessSchema(settings: {
  businessPhone?: string;
  businessEmail?: string;
  businessAddress?: string;
  businessCity?: string;
  businessZipCode?: string;
  hoursWeekday?: string;
  hoursSaturday?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "AutoRepair"],
    name: "TM AUTO SERVICE",
    description:
      "Garage automobile multi-marques à Quesnoy-sur-Deûle : diagnostic, réparation, entretien, achat/vente, reprise et location de véhicules.",
    url: "https://tm-auto-service.fr",
    telephone: settings.businessPhone || "+33641413489",
    email: settings.businessEmail || "contact@tm-auto-service.fr",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.businessAddress || "",
      addressLocality: settings.businessCity || "Quesnoy-sur-Deûle",
      postalCode: settings.businessZipCode || "59890",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 50.7169,
      longitude: 2.9781,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
    image: "https://tm-auto-service.fr/brand/logo.png",
    priceRange: "€€",
    areaServed: {
      "@type": "City",
      name: "Quesnoy-sur-Deûle",
    },
  };
}

export function vehicleSchema(vehicle: {
  title: string;
  make: string;
  model: string;
  year: number;
  mileage?: number | null;
  price?: number | null;
  fuel: string;
  transmission: string;
  description?: string | null;
  images?: { url: string }[];
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: vehicle.title,
    brand: { "@type": "Brand", name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: vehicle.year.toString(),
    mileageFromOdometer: vehicle.mileage
      ? {
          "@type": "QuantitativeValue",
          value: vehicle.mileage,
          unitCode: "KMT",
        }
      : undefined,
    fuelType: vehicle.fuel,
    vehicleTransmission: vehicle.transmission,
    description: vehicle.description || "",
    image: vehicle.images?.[0]?.url || "",
    url: `https://tm-auto-service.fr/vehicules/${vehicle.slug}`,
    offers: vehicle.price
      ? {
          "@type": "Offer",
          price: vehicle.price,
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };
}
