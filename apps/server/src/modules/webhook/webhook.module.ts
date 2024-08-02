import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { WebhookController } from './webhook.controller';
import WebhookService from './webhook.service';

@Module({
  imports: [PrismaModule],
  controllers: [WebhookController],
  providers: [PrismaService, WebhookService],
  exports: [],
})
export class WebhookModule {}
