/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import NotificationsService from './notifications.service';
import { BullModule } from '@nestjs/bull';
import { NotificationsQueue } from './notifications.queue';
import { NotificationsProcessor } from './notifications.processor';
import { NotificationsController } from './notifications.controller';

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
