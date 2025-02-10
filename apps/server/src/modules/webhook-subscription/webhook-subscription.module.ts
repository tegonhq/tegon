import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';

import { WebhookSubscriptionController } from './webhook-subscription.controller';
import WebhookSubscriptionService from './webhook-subscription.service';

@Module({
  imports: [PrismaModule],
  controllers: [WebhookSubscriptionController],
  providers: [WebhookSubscriptionService, PrismaService, UsersService],
  exports: [WebhookSubscriptionService],
})
export class WebhookSubscriptionModule {}
