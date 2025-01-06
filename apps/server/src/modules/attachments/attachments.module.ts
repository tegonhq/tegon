import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';

import { AttachmentController } from './attachments.controller';
import { AttachmentService } from './attachments.service';
import { StorageFactory } from './storage.factory';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [AttachmentController],
  providers: [AttachmentService, PrismaService, UsersService, StorageFactory],
  exports: [AttachmentService],
})
export class AttachmentModule {}
