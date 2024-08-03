import { Body, Controller, Post, Headers, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventBody, EventHeaders } from '@tegonhq/types';

import WebhookService from './webhook.service';

@Controller({
  version: '1',
  path: 'webhook',
})
@ApiTags('Webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post(':sourceName')
  async slackEvents(
    @Headers() eventHeaders: EventHeaders,
    @Param('sourceName') sourceName: string,
    @Body() eventBody: EventBody,
  ) {
    return await this.webhookService.handleEvents(
      sourceName,
      eventHeaders,
      eventBody,
    );
  }
}
