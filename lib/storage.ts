export interface StorageUploadResult {
  url: string;
  key: string;
  mimeType: string;
  sizeBytes: number;
}

export interface StorageService {
  upload(file: File | Buffer, filename: string, mimeType: string): Promise<StorageUploadResult>;
  delete(key: string): Promise<boolean>;
}

// In-memory/local mock implementation for serverless/local dev
class LocalStorageService implements StorageService {
  async upload(file: File | Buffer, filename: string, mimeType: string): Promise<StorageUploadResult> {
    const timestamp = Date.now();
    const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `uploads/${timestamp}-${cleanName}`;
    
    // In production with S3 / Vercel Blob, this generates a real hosted CDN URL
    const url = process.env.STORAGE_PUBLIC_URL 
      ? `${process.env.STORAGE_PUBLIC_URL}/${key}`
      : `/api/media/${key}`;

    const sizeBytes = Buffer.isBuffer(file) ? file.length : (file as File).size || 1024;

    return {
      url,
      key,
      mimeType,
      sizeBytes,
    };
  }

  async delete(key: string): Promise<boolean> {
    // Simulated deletion
    return true;
  }
}

export const storage: StorageService = new LocalStorageService();
