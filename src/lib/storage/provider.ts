// ─── Storage Provider Interface ──────────────────────────────────────
// TODO: Pour passer de local à Supabase Storage ou Cloudflare R2:
// 1. Créer un fichier supabase.ts ou r2.ts implémentant StorageProvider
// 2. Modifier getStorageProvider() ci-dessous pour retourner le bon provider
// 3. Configurer les variables d'environnement nécessaires

export interface StorageProvider {
  upload(file: Buffer, filename: string, contentType: string): Promise<string>;
  delete(url: string): Promise<void>;
  getUrl(path: string): string;
}

export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER || "local";

  if (provider === "vercel-blob") {
    const { VercelBlobStorage } = require("./vercel-blob");
    return new VercelBlobStorage();
  }

  // Default: local storage (dev only)
  const { LocalStorage } = require("./local");
  return new LocalStorage();
}
