// TODO: Implémenter Supabase Storage
// import { createClient } from '@supabase/supabase-js';
// import { StorageProvider } from './provider';
//
// export class SupabaseStorage implements StorageProvider {
//   private client;
//   private bucket = 'vehicles';
//
//   constructor() {
//     this.client = createClient(
//       process.env.SUPABASE_URL!,
//       process.env.SUPABASE_SERVICE_KEY!
//     );
//   }
//
//   async upload(file: Buffer, filename: string, contentType: string): Promise<string> {
//     const uniqueName = `${Date.now()}-${filename}`;
//     const { error } = await this.client.storage
//       .from(this.bucket)
//       .upload(uniqueName, file, { contentType });
//     if (error) throw error;
//     const { data } = this.client.storage.from(this.bucket).getPublicUrl(uniqueName);
//     return data.publicUrl;
//   }
//
//   async delete(url: string): Promise<void> {
//     const path = url.split('/').pop()!;
//     await this.client.storage.from(this.bucket).remove([path]);
//   }
//
//   getUrl(path: string): string {
//     return path;
//   }
// }
