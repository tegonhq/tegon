import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateWebhookSubscriptionDto } from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Workspace } from 'modules/auth/session.decorator';

import WebhookSubscriptionService from './webhook-subscription.service';

@Controller({
  version: '1',
  path: 'webhook-subscription',
})
export class WebhookSubscriptionController {
  constructor(private webhookSubscriptionService: WebhookSubscriptionService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getWebhooks(@Workspace() workspaceId: string) {
    return await this.webhookSubscriptionService.getWebhookSubscriptions(
      workspaceId,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async createWebhook(
    @Body() data: CreateWebhookSubscriptionDto,
    @Workspace() workspaceId: string,
  ) {
    return await this.webhookSubscriptionService.createWebhookSubscription(
      workspaceId,
      data,
    );
  }

  @Post(':webhookSubscriptionId')
  @UseGuards(AuthGuard)
  async updateWebhook(
    @Param('webhookSubscriptionId') webhookSubscriptionId: string,
    @Body() data: Partial<CreateWebhookSubscriptionDto>,
  ) {
    return await this.webhookSubscriptionService.updateWebhookSubscription(
      webhookSubscriptionId,
      data,
    );
  }

  @Delete(':webhookSubscriptionId')
  @UseGuards(AuthGuard)
  async deleteWebhook(
    @Param('webhookSubscriptionId') webhookSubscriptionId: string,
  ) {
    return await this.webhookSubscriptionService.deleteWebhookSubscription(
      webhookSubscriptionId,
    );
  }
}
