import "dotenv/config";
import { createClient } from "@libsql/client";

const c = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });

function cuid() {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

async function main() {
  const now = new Date().toISOString();

  // Get vehicle IDs
  const vehicles = await c.execute('SELECT id, slug FROM "Vehicle"');
  console.log("Found vehicles:", vehicles.rows.map(v => v.slug));

  const peugeotId = vehicles.rows.find(v => v.slug === "peugeot-308-2022")?.id as string;
  const audiId = vehicles.rows.find(v => v.slug === "audi-a3-sportback-2021")?.id as string;
  const renaultId = vehicles.rows.find(v => v.slug === "renault-clio-location-2023")?.id as string;

  // Add images for each vehicle using the local upload files
  // Assign first upload to Peugeot, second to Audi
  const images = [
    { id: cuid(), vehicleId: peugeotId, url: "/uploads/1772319499380-1772319499379-ricvon.webp", alt: "Peugeot 308 GT", order: 0 },
    { id: cuid(), vehicleId: audiId, url: "/uploads/1772319544070-1772319544069-mirfj5.webp", alt: "Audi A3 Sportback S-Line", order: 0 },
  ];

  for (const img of images) {
    await c.execute({
      sql: `INSERT OR IGNORE INTO "VehicleImage" ("id", "vehicleId", "url", "alt", "order") VALUES (?, ?, ?, ?, ?)`,
      args: [img.id, img.vehicleId, img.url, img.alt, img.order],
    });
    console.log(`✅ Image added: ${img.alt} -> ${img.url}`);
  }

  // Verify
  const check = await c.execute('SELECT id, vehicleId, url, alt FROM "VehicleImage"');
  console.log("\nAll images in DB:", JSON.stringify(check.rows, null, 2));

  c.close();
}

main().catch(e => { console.error(e); process.exit(1); });
