/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Body, Controller, Param, Post, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  WebhookEventBody,
  WebhookEventHeaders,
  WebhookEventParams,
} from './webhooks.interface';
import WebhookService from './webhooks.service';

@Controller({
  version: '1',
  path: 'webhook',
})
@ApiTags('Webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post(':eventSource')
  async webhookEvents(
    @Param() webhookEventParams: WebhookEventParams,
    @Headers() eventHeaders: WebhookEventHeaders,
    @Body() eventBody: WebhookEventBody,
  ) {
    return await this.webhookService.handleEvents(
      webhookEventParams,
      eventHeaders,
      eventBody,
    );
  }
}
