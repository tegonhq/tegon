import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { NotificationsController } from './notifications.controller';
import { NotificationsProcessor } from './notifications.processor';
import { NotificationsQueue } from './notifications.queue';
import NotificationsService from './notifications.service';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    BullModule.registerQueue({ name: 'notifications' }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    PrismaService,
    NotificationsQueue,
    NotificationsProcessor,
  ],
  exports: [NotificationsService, NotificationsQueue],
})
export class NotificationsModule {}
