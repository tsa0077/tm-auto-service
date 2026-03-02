import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "";
const authToken = process.env.TURSO_AUTH_TOKEN || "";
const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Settings ─────────────────────────────────────────────
  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      businessName: "TM Auto Service",
      businessAddress: "123 Avenue de la République, 93100 Montreuil",
      businessPhone: "+33 6 41 41 34 89",
      businessEmail: "contact@tm-auto-service.fr",
      businessHours: "Lun-Ven: 8h30-19h, Sam: 9h-17h",
      businessDescription:
        "Garage automobile multimarque : vente, location, reprise, entretien et réparation à Montreuil.",
      whatsappEnabled: true,
      whatsappNumber: "+33641413489",
      whatsappMessage: "Bonjour, je vous contacte depuis votre site web.",
      chatEnabled: false,
      chatProvider: "TAWK",
    },
  });
  console.log("✅ Settings created:", settings.id);

  // ─── Admin User ───────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@tm-auto-service.fr" },
    update: {},
    create: {
      email: "admin@tm-auto-service.fr",
      password: hashedPassword,
      name: "Administrateur",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // ─── Vehicles (Sale) ─────────────────────────────────────
  const vehicle1 = await prisma.vehicle.upsert({
    where: { slug: "peugeot-308-2022" },
    update: {},
    create: {
      type: "SALE",
      status: "AVAILABLE",
      title: "Peugeot 308 1.5 BlueHDi 130 GT",
      slug: "peugeot-308-2022",
      make: "Peugeot",
      model: "308",
      year: 2022,
      price: 24990,
      mileage: 32000,
      fuel: "DIESEL",
      transmission: "AUTOMATIQUE",
      power: "130ch",
      color: "Gris Artense",
      doors: 5,
      seats: 5,
      description:
        "Magnifique Peugeot 308 GT en excellent état. Entretien complet effectué chez nous. Véhicule non-fumeur, carnet d'entretien à jour.",
      features: JSON.stringify([
        "GPS tactile 10 pouces",
        "Caméra de recul",
        "Radar de stationnement avant/arrière",
        "Climatisation automatique bi-zone",
        "Sièges chauffants",
        "Aide au stationnement actif",
      ]),
      options: JSON.stringify(["Pack GT", "Peinture métallisée", "Vitres surteintées"]),
      featured: true,

    },
  });
  console.log("✅ Vehicle created:", vehicle1.title);

  const vehicle2 = await prisma.vehicle.upsert({
    where: { slug: "audi-a3-sportback-2021" },
    update: {},
    create: {
      type: "SALE",
      status: "AVAILABLE",
      title: "Audi A3 Sportback 35 TFSI S-Line",
      slug: "audi-a3-sportback-2021",
      make: "Audi",
      model: "A3",
      year: 2021,
      price: 29990,
      mileage: 45000,
      fuel: "ESSENCE",
      transmission: "AUTOMATIQUE",
      power: "150ch",
      color: "Noir Mythic",
      doors: 5,
      seats: 5,
      description:
        "Audi A3 Sportback en finition S-Line, full options. Première main, suivi complet en concession.",
      features: JSON.stringify([
        "Virtual cockpit",
        "GPS MMI Plus",
        "Caméra de recul",
        "LED Matrix",
        "Audi Connect",
        "Régulateur adaptatif",
      ]),
      options: JSON.stringify(["Pack S-Line extérieur", "Pack S-Line intérieur", "Bang & Olufsen"]),
      featured: true,

    },
  });
  console.log("✅ Vehicle created:", vehicle2.title);

  // ─── Vehicle (Rent) ───────────────────────────────────────
  const vehicle3 = await prisma.vehicle.upsert({
    where: { slug: "renault-clio-location-2023" },
    update: {},
    create: {
      type: "RENT",
      status: "AVAILABLE",
      title: "Renault Clio 5 TCe 90 — Location",
      slug: "renault-clio-location-2023",
      make: "Renault",
      model: "Clio",
      year: 2023,
      mileage: 12000,
      fuel: "ESSENCE",
      transmission: "MANUELLE",
      power: "90ch",
      color: "Blanc Glacier",
      doors: 5,
      seats: 5,
      description:
        "Renault Clio 5 idéale pour vos déplacements quotidiens ou vacances. Véhicule propre, bien entretenu, faible consommation.",
      features: JSON.stringify([
        "GPS intégré",
        "Climatisation",
        "Bluetooth",
        "Régulateur de vitesse",
        "Radar de recul",
      ]),
      options: JSON.stringify([]),
      dailyRate: 35,
      weeklyRate: 200,
      monthlyRate: 650,
      deposit: 800,
      featured: false,

    },
  });
  console.log("✅ Vehicle created:", vehicle3.title);

  // ─── Leads ────────────────────────────────────────────────
  const leads = [
    {
      source: "CONTACT",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@email.fr",
      phone: "06 12 34 56 78",
      message: "Bonjour, je suis intéressé par la Peugeot 308 GT. Est-elle encore disponible ?",
      vehicleId: vehicle1.id,
      status: "NEW",
    },
    {
      source: "VEHICLE",
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@email.fr",
      phone: "06 98 76 54 32",
      message: "Je souhaite prendre rendez-vous pour un essai de l'Audi A3.",
      vehicleId: vehicle2.id,
      status: "CONTACTED",
    },
    {
      source: "REPRISE",
      firstName: "Pierre",
      lastName: "Petit",
      email: "pierre.petit@email.fr",
      phone: "07 11 22 33 44",
      message: "Je souhaite faire estimer mon véhicule pour une reprise.",
      repriseMarque: "Volkswagen",
      repriseModele: "Golf 7",
      repriseAnnee: 2018,
      repriseKm: 95000,
      repriseDetails: "Bon état général, carnet à jour",
      status: "IN_PROGRESS",
    },
    {
      source: "LOCATION",
      firstName: "Sophie",
      lastName: "Leroy",
      email: "sophie.leroy@email.fr",
      phone: "06 77 88 99 00",
      message: "Disponibilité de la Clio pour la semaine du 15 au 22 juillet ?",
      vehicleId: vehicle3.id,
      status: "CONVERTED",
    },
    {
      source: "CONTACT",
      firstName: "Ahmed",
      lastName: "Benali",
      email: "ahmed.benali@email.fr",
      phone: "06 55 44 33 22",
      message: "Quels sont vos tarifs pour un entretien complet (vidange + filtres + freins) ?",
      status: "LOST",
    },
  ];

  for (const lead of leads) {
    await prisma.lead.create({ data: lead as never });
  }
  console.log("✅ 5 Leads created");

  console.log("\n🎉 Seed completed!");
  console.log("📧 Admin login: admin@tm-auto-service.fr / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
