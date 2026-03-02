import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

async function main() {
  const url = process.env.TURSO_DATABASE_URL!;
  const authToken = process.env.TURSO_AUTH_TOKEN!;

  if (!url || !authToken) {
    console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
    process.exit(1);
  }

  console.log(`Connecting to: ${url}`);
  const client = createClient({ url, authToken });

  // Read and execute migration SQL
  const raw = readFileSync(join(__dirname, "migration.sql"), "utf-8");
  // Remove BOM, strip comment-only lines, normalize whitespace
  const sql = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const statements = sql
    .split(";\n")
    .map((s) => s.replace(/^--.*$/gm, "").trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  console.log(`Executing ${statements.length} SQL statements...`);
  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      const tableName = stmt.match(/CREATE TABLE "(\w+)"/)?.[1] || stmt.match(/CREATE UNIQUE INDEX/)?.[0] || stmt.substring(0, 50);
      console.log(`  ✓ ${tableName}`);
    } catch (err: any) {
      if (err.message?.includes("already exists")) {
        console.log(`  ⏭ Skipped (already exists): ${stmt.substring(0, 50)}...`);
      } else {
        console.error(`  ✗ Error: ${err.message}`);
        console.error(`    Statement: ${stmt.substring(0, 100)}...`);
      }
    }
  }

  console.log("\n✓ Schema push complete!");
  client.close();
}

main().catch(console.error);
