import { Body, Controller, Post, Headers, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventBody, EventHeaders } from '@tegonhq/types';
import { Response } from 'express';

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
    @Res() response: Response,
  ) {
    const eventResponse = await this.webhookService.handleEvents(
      response,
      sourceName,
      eventHeaders,
      eventBody,
    );
    return eventResponse;
  }
}
