import { put, del } from "@vercel/blob";
import { StorageProvider } from "./provider";

export class VercelBlobStorage implements StorageProvider {
  async upload(
    file: Buffer,
    filename: string,
    contentType: string
  ): Promise<string> {
    const blob = await put(filename, file, {
      access: "public",
      contentType,
    });
    return blob.url;
  }

  async delete(url: string): Promise<void> {
    try {
      await del(url);
    } catch {
      // Ignore delete errors
    }
  }

  getUrl(filePath: string): string {
    return filePath;
  }
}
