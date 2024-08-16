import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';

import { WebhookController } from './webhook.controller';
import WebhookService from './webhook.service';

@Module({
  imports: [PrismaModule],
  controllers: [WebhookController],
  providers: [PrismaService, WebhookService, TriggerdevService],
  exports: [],
})
export class WebhookModule {}
