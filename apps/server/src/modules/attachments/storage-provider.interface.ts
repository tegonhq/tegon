export interface StorageProvider {
  uploadFile(
    filePath: string,
    buffer: Buffer,
    options: StorageUploadOptions,
  ): Promise<void>;

  getSignedUrl(filePath: string, options: SignedUrlOptions): Promise<string>;

  downloadFile(filePath: string): Promise<Buffer>;

  deleteFile(filePath: string): Promise<void>;

  fileExists(filePath: string): Promise<boolean>;

  getMetadata(filePath: string): Promise<{ size: number; contentType: string }>;
}

export interface StorageUploadOptions {
  contentType: string;
  metadata?: Record<string, string>;
  resumable?: boolean;
  validation?: boolean;
}

export interface SignedUrlOptions {
  action: 'read' | 'write';
  expires: number;
  contentType?: string;
  responseDisposition?: string;
  responseType?: string;
}
