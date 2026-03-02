import { StorageProvider } from "./provider";
import fs from "fs";
import path from "path";

export class LocalStorage implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(
    file: Buffer,
    filename: string,
    _contentType: string
  ): Promise<string> {
    const uniqueName = `${Date.now()}-${filename}`;
    const filePath = path.join(this.uploadDir, uniqueName);
    fs.writeFileSync(filePath, file);
    return `/uploads/${uniqueName}`;
  }

  async delete(url: string): Promise<void> {
    const filename = url.replace("/uploads/", "");
    const filePath = path.join(this.uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getUrl(filePath: string): string {
    return filePath;
  }
}
