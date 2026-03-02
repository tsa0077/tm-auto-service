import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import VehicleForm from "@/components/admin/vehicle-form";

export default async function EditVehiculePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!vehicle) notFound();

  const serialized = {
    id: vehicle.id,
    type: vehicle.type,
    status: vehicle.status,
    title: vehicle.title,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    price: vehicle.price ? Number(vehicle.price) : null,
    priceLabel: vehicle.priceLabel,
    mileage: vehicle.mileage,
    fuel: vehicle.fuel,
    transmission: vehicle.transmission,
    power: vehicle.power,
    color: vehicle.color,
    doors: vehicle.doors,
    seats: vehicle.seats,
    description: vehicle.description,
    features: vehicle.features,
    options: vehicle.options,
    dailyRate: vehicle.dailyRate ? Number(vehicle.dailyRate) : null,
    weeklyRate: vehicle.weeklyRate ? Number(vehicle.weeklyRate) : null,
    monthlyRate: vehicle.monthlyRate ? Number(vehicle.monthlyRate) : null,
    deposit: vehicle.deposit ? Number(vehicle.deposit) : null,
    featured: vehicle.featured,
    images: vehicle.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || vehicle.title,
    })),
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Modifier : {vehicle.title}</h1>
      <VehicleForm vehicle={serialized} />
    </div>
  );
}
