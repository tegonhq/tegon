import {
  S3,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

import {
  StorageProvider,
  StorageUploadOptions,
  SignedUrlOptions,
} from './storage-provider.interface';

@Injectable()
export class S3StorageProvider implements StorageProvider {
  private s3: S3;
  private bucketName: string;

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = process.env.BUCKET_NAME;
  }

  async uploadFile(
    filePath: string,
    buffer: Buffer,
    options: StorageUploadOptions,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
      Body: buffer,
      ContentType: options.contentType,
      Metadata: options.metadata,
    });

    await this.s3.send(command);
  }

  async getSignedUrl(
    filePath: string,
    options: SignedUrlOptions,
  ): Promise<string> {
    const command =
      options.action === 'read'
        ? new GetObjectCommand({
            Bucket: this.bucketName,
            Key: filePath,
            ResponseContentType: options.responseType,
            ResponseContentDisposition: options.responseDisposition,
          })
        : new PutObjectCommand({
            Bucket: this.bucketName,
            Key: filePath,
            ContentType: options.contentType,
          });

    return await getSignedUrl(this.s3, command, {
      expiresIn: Math.floor((options.expires - Date.now()) / 1000),
    });
  }

  async downloadFile(filePath: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
    });

    const response = await this.s3.send(command);
    return Buffer.from(await response.Body.transformToByteArray());
  }

  async deleteFile(filePath: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
    });

    await this.s3.send(command);
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
      });
      await this.s3.send(command);
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  async getMetadata(
    filePath: string,
  ): Promise<{ size: number; contentType: string }> {
    const command = new HeadObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
    });

    const response = await this.s3.send(command);
    return {
      size: response.ContentLength,
      contentType: response.ContentType,
    };
  }
}
