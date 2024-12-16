import { Injectable } from '@nestjs/common';

import { GCPStorageProvider } from './gcp-storage.provider';
import { S3StorageProvider } from './s3-storage.provider';
import { StorageProvider } from './storage-provider.interface';

@Injectable()
export class StorageFactory {
  createStorageProvider(): StorageProvider {
    const provider = process.env.STORAGE_PROVIDER?.toLowerCase() || 'gcp';

    switch (provider) {
      case 'aws':
        return new S3StorageProvider();
      case 'gcp':
      default:
        return new GCPStorageProvider();
    }
  }
}
