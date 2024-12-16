import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

import {
  StorageProvider,
  StorageUploadOptions,
  SignedUrlOptions,
} from './storage-provider.interface';

@Injectable()
export class GCPStorageProvider implements StorageProvider {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage({
      keyFilename: process.env.GCP_SERVICE_ACCOUNT_FILE,
    });
    this.bucketName = process.env.BUCKET_NAME;
  }

  // Only implement pure storage operations
  async uploadFile(
    filePath: string,
    buffer: Buffer,
    options: StorageUploadOptions,
  ): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(filePath);
    await blob.save(buffer, {
      resumable: options.resumable,
      validation: options.validation,
      metadata: {
        contentType: options.contentType,
        ...options.metadata,
      },
    });
  }

  async getSignedUrl(
    filePath: string,
    options: SignedUrlOptions,
  ): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const [url] = await bucket.file(filePath).getSignedUrl({
      version: 'v4',
      action: options.action,
      expires: options.expires,
      contentType: options.contentType,
      responseDisposition: options.responseDisposition,
      responseType: options.responseType,
    });
    return url;
  }

  async downloadFile(filePath: string): Promise<Buffer> {
    const bucket = this.storage.bucket(this.bucketName);
    const [buffer] = await bucket.file(filePath).download();
    return buffer;
  }

  async deleteFile(filePath: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    await bucket.file(filePath).delete();
  }

  async fileExists(filePath: string): Promise<boolean> {
    const bucket = this.storage.bucket(this.bucketName);
    const [exists] = await bucket.file(filePath).exists();
    return exists;
  }

  async getMetadata(
    filePath: string,
  ): Promise<{ size: number; contentType: string }> {
    const bucket = this.storage.bucket(this.bucketName);
    const [metadata] = await bucket.file(filePath).getMetadata();
    return {
      size: Number(metadata.size),
      contentType: metadata.contentType,
    };
  }
}
