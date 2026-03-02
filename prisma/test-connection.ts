import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;
console.log("URL:", url ? url.substring(0, 30) + "..." : "MISSING");
console.log("Token:", authToken ? "SET" : "MISSING");

const adapter = new PrismaLibSql({ url, authToken });
console.log("Adapter created");

const prisma = new PrismaClient({ adapter });
console.log("PrismaClient created");

async function test() {
  try {
    const result = await prisma.settings.findFirst();
    console.log("Query result:", result);
  } catch (e: any) {
    console.error("Query error:", e.code, e.message);
  }
  await prisma.$disconnect();
}

test();
