"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VehicleGalleryProps {
  images: { url: string; alt: string }[];
}

export default function VehicleGallery({ images }: VehicleGalleryProps) {
  const [current, setCurrent] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-[4/3] bg-neutral-100 rounded-lg flex items-center justify-center text-muted-foreground">
        Aucune image
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={images[current].url}
          alt={images[current].alt || "Véhicule"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
          unoptimized
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-16 h-16 rounded-md overflow-hidden shrink-0 border-2 transition ${
                i === current ? "border-red-600" : "border-transparent"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `Photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
