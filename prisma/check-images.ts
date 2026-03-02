import "dotenv/config";
import { createClient } from "@libsql/client";

const c = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });

async function main() {
  const r = await c.execute('SELECT id, slug, title FROM "Vehicle"');
  console.log("Vehicles:", JSON.stringify(r.rows, null, 2));
  const imgs = await c.execute('SELECT * FROM "VehicleImage"');
  console.log("Images:", JSON.stringify(imgs.rows, null, 2));
  c.close();
}
main();
