"use client";

import Image from "next/image";

/**
 * Featured brands – big names displayed as circles with a sliding marquee animation.
 * Two rows scroll in opposite directions for a dynamic feel.
 */

const BRANDS_ROW_1 = [
  { name: "Audi", file: "audi" },
  { name: "BMW", file: "bmw" },
  { name: "Mercedes-Benz", file: "mercedes-benz" },
  { name: "Volkswagen", file: "volkswagen" },
  { name: "Renault", file: "renault" },
  { name: "Peugeot", file: "peugeot" },
  { name: "Toyota", file: "toyota" },
  { name: "Ford", file: "ford" },
  { name: "Citroën", file: "citroen" },
  { name: "Opel", file: "opel" },
  { name: "Fiat", file: "fiat" },
  { name: "Hyundai", file: "hyundai" },
  { name: "Kia", file: "kia" },
  { name: "Nissan", file: "nissan" },
  { name: "Mazda", file: "mazda" },
  { name: "Honda", file: "honda" },
  { name: "Dacia", file: "dacia" },
  { name: "Škoda", file: "skoda" },
  { name: "SEAT", file: "seat" },
  { name: "MINI", file: "mini" },
];

const BRANDS_ROW_2 = [
  { name: "Volvo", file: "volvo" },
  { name: "Jaguar", file: "jaguar" },
  { name: "Porsche", file: "porsche" },
  { name: "Land Rover", file: "land-rover" },
  { name: "Alfa Romeo", file: "alfa-romeo" },
  { name: "Jeep", file: "jeep" },
  { name: "Tesla", file: "tesla" },
  { name: "Cupra", file: "cupra" },
  { name: "DS", file: "ds" },
  { name: "Lamborghini", file: "lamborghini" },
  { name: "Ferrari", file: "ferrari" },
  { name: "Maserati", file: "maserati" },
  { name: "Bentley", file: "bentley" },
  { name: "Rolls-Royce", file: "rolls-royce" },
  { name: "Lexus", file: "lexus" },
  { name: "Infiniti", file: "infiniti" },
  { name: "Genesis", file: "genesis" },
  { name: "Subaru", file: "subaru" },
  { name: "Suzuki", file: "suzuki" },
  { name: "Mitsubishi", file: "mitsubishi" },
];

function LogoCircle({ name, file }: { name: string; file: string }) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0 mx-3 sm:mx-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-md border border-neutral-100 flex items-center justify-center p-3 hover:shadow-lg hover:scale-110 transition-all duration-300">
        <Image
          src={`/brands/${file}.png`}
          alt={name}
          width={64}
          height={64}
          className="object-contain w-full h-full"
          unoptimized
        />
      </div>
      <span className="text-[10px] sm:text-xs text-neutral-500 font-medium text-center leading-tight whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

function MarqueeRow({
  brands,
  direction = "left",
  speed = 40,
}: {
  brands: { name: string; file: string }[];
  direction?: "left" | "right";
  speed?: number;
}) {
  // Duplicate the array for seamless loop
  const items = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-neutral-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-neutral-50 to-transparent z-10 pointer-events-none" />

      <div
        className={`flex ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {items.map((brand, i) => (
          <LogoCircle key={`${brand.file}-${i}`} name={brand.name} file={brand.file} />
        ))}
      </div>
    </div>
  );
}

export default function BrandLogos() {
  return (
    <section className="py-10 md:py-14 bg-neutral-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Toutes Marques
        </h2>
        <p className="text-muted-foreground text-center text-sm md:text-base">
          Nous intervenons sur toutes les marques automobiles
        </p>
      </div>

      <div className="space-y-6">
        <MarqueeRow brands={BRANDS_ROW_1} direction="left" speed={45} />
        <MarqueeRow brands={BRANDS_ROW_2} direction="right" speed={50} />
      </div>
    </section>
  );
}
