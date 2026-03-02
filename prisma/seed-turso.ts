import "dotenv/config";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

if (!url || !authToken) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  process.exit(1);
}

const client = createClient({ url, authToken });

function cuid() {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

async function main() {
  console.log("🌱 Seeding database via libsql...");
  const now = new Date().toISOString();

  // ─── Settings ─────────────────────────────────────────────
  await client.execute({
    sql: `INSERT OR IGNORE INTO "Settings" ("id", "trackingEnabled", "metaPixelId", "ga4MeasurementId", "gtmId", "cookieConsentEnabled", "whatsappEnabled", "whatsappNumber", "whatsappMessage", "chatEnabled", "chatProvider", "chatScript", "businessName", "businessPhone", "businessEmail", "businessAddress", "businessCity", "businessZipCode", "businessCountry", "businessHours", "businessDescription", "googleMapsUrl", "socialFacebook", "socialInstagram", "socialGoogle", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      "singleton", false, "", "", "", true,
      true, "+33641413489", "Bonjour, je vous contacte depuis votre site web.",
      false, "TAWK", "",
      "TM Auto Service", "+33 6 41 41 34 89", "contact@tm-auto-service.fr",
      "123 Avenue de la République, 93100 Montreuil", "", "", "France",
      "Lun-Ven: 8h30-19h, Sam: 9h-17h",
      "Garage automobile multimarque : vente, location, reprise, entretien et réparation à Montreuil.",
      "", "", "", "",
      now, now,
    ],
  });
  console.log("✅ Settings created");

  // ─── Admin User ───────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const adminId = cuid();
  await client.execute({
    sql: `INSERT OR IGNORE INTO "AdminUser" ("id", "email", "password", "name", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?)`,
    args: [adminId, "admin@tm-auto-service.fr", hashedPassword, "Administrateur", now, now],
  });
  console.log("✅ Admin user created: admin@tm-auto-service.fr");

  // ─── Vehicles (Sale) ─────────────────────────────────────
  const v1Id = cuid();
  await client.execute({
    sql: `INSERT OR IGNORE INTO "Vehicle" ("id", "type", "status", "slug", "title", "make", "model", "year", "price", "mileage", "fuel", "transmission", "power", "color", "doors", "seats", "description", "features", "options", "featured", "publishedAt", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      v1Id, "SALE", "AVAILABLE", "peugeot-308-2022",
      "Peugeot 308 1.5 BlueHDi 130 GT", "Peugeot", "308", 2022, 24990, 32000,
      "DIESEL", "AUTOMATIQUE", "130ch", "Gris Artense", 5, 5,
      "Magnifique Peugeot 308 GT en excellent état. Entretien complet effectué chez nous.",
      JSON.stringify(["GPS tactile 10 pouces", "Caméra de recul", "Radar de stationnement", "Climatisation bi-zone", "Sièges chauffants"]),
      JSON.stringify(["Pack GT", "Peinture métallisée", "Vitres surteintées"]),
      true, now, now, now,
    ],
  });
  console.log("✅ Vehicle: Peugeot 308 GT");

  const v2Id = cuid();
  await client.execute({
    sql: `INSERT OR IGNORE INTO "Vehicle" ("id", "type", "status", "slug", "title", "make", "model", "year", "price", "mileage", "fuel", "transmission", "power", "color", "doors", "seats", "description", "features", "options", "featured", "publishedAt", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      v2Id, "SALE", "AVAILABLE", "audi-a3-sportback-2021",
      "Audi A3 Sportback 35 TFSI S-Line", "Audi", "A3", 2021, 29990, 45000,
      "ESSENCE", "AUTOMATIQUE", "150ch", "Noir Mythic", 5, 5,
      "Audi A3 Sportback en finition S-Line, full options. Première main.",
      JSON.stringify(["Virtual cockpit", "GPS MMI Plus", "Caméra de recul", "LED Matrix", "Audi Connect"]),
      JSON.stringify(["Pack S-Line extérieur", "Pack S-Line intérieur", "Bang & Olufsen"]),
      true, now, now, now,
    ],
  });
  console.log("✅ Vehicle: Audi A3 S-Line");

  const v3Id = cuid();
  await client.execute({
    sql: `INSERT OR IGNORE INTO "Vehicle" ("id", "type", "status", "slug", "title", "make", "model", "year", "price", "mileage", "fuel", "transmission", "power", "color", "doors", "seats", "description", "features", "options", "dailyRate", "weeklyRate", "monthlyRate", "deposit", "featured", "publishedAt", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      v3Id, "RENT", "AVAILABLE", "renault-clio-location-2023",
      "Renault Clio 5 TCe 90 — Location", "Renault", "Clio", 2023, null, 12000,
      "ESSENCE", "MANUELLE", "90ch", "Blanc Glacier", 5, 5,
      "Renault Clio 5 idéale pour vos déplacements quotidiens ou vacances.",
      JSON.stringify(["GPS intégré", "Climatisation", "Bluetooth", "Régulateur de vitesse"]),
      JSON.stringify([]),
      35, 200, 650, 800, false, now, now, now,
    ],
  });
  console.log("✅ Vehicle: Renault Clio Location");

  // ─── Leads ────────────────────────────────────────────────
  const leads = [
    { source: "CONTACT", status: "NEW", firstName: "Jean", lastName: "Dupont", email: "jean.dupont@email.fr", phone: "06 12 34 56 78", message: "Bonjour, je suis intéressé par la Peugeot 308 GT.", vehicleId: v1Id },
    { source: "VEHICLE", status: "CONTACTED", firstName: "Marie", lastName: "Martin", email: "marie.martin@email.fr", phone: "06 98 76 54 32", message: "Je souhaite prendre rendez-vous pour un essai de l'Audi A3.", vehicleId: v2Id },
    { source: "REPRISE", status: "IN_PROGRESS", firstName: "Pierre", lastName: "Petit", email: "pierre.petit@email.fr", phone: "07 11 22 33 44", message: "Je souhaite faire estimer mon véhicule.", vehicleId: null, repriseMarque: "Volkswagen", repriseModele: "Golf 7", repriseAnnee: 2018, repriseKm: 95000, repriseDetails: "Bon état général" },
    { source: "LOCATION", status: "CONVERTED", firstName: "Sophie", lastName: "Leroy", email: "sophie.leroy@email.fr", phone: "06 77 88 99 00", message: "Disponibilité de la Clio pour la semaine du 15 au 22 juillet ?", vehicleId: v3Id },
    { source: "CONTACT", status: "LOST", firstName: "Ahmed", lastName: "Benali", email: "ahmed.benali@email.fr", phone: "06 55 44 33 22", message: "Quels sont vos tarifs pour un entretien complet ?", vehicleId: null },
  ];

  for (const l of leads) {
    await client.execute({
      sql: `INSERT INTO "Lead" ("id", "source", "status", "firstName", "lastName", "email", "phone", "message", "vehicleId", "repriseMarque", "repriseModele", "repriseAnnee", "repriseKm", "repriseDetails", "metadata", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        cuid(), l.source, l.status, l.firstName, l.lastName, l.email, l.phone, l.message,
        l.vehicleId || null,
        (l as any).repriseMarque || null, (l as any).repriseModele || null,
        (l as any).repriseAnnee || null, (l as any).repriseKm || null,
        (l as any).repriseDetails || null, null, now, now,
      ],
    });
  }
  console.log("✅ 5 Leads created");

  console.log("\n🎉 Seed completed!");
  console.log("📧 Admin login: admin@tm-auto-service.fr / admin123");

  client.close();
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
