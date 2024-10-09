import {
  Body,
  Controller,
  Post,
  Headers,
  Param,
  Res,
  Get,
  Query,
} from '@nestjs/common';
import { EventBody, EventHeaders } from '@tegonhq/types';
import { Response } from 'express';

import WebhookService from './webhook.service';

@Controller({
  version: '1',
  path: 'webhook',
})
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post(':sourceName')
  async slackEvents(
    @Headers() eventHeaders: EventHeaders,
    @Param('sourceName') sourceName: string,
    @Body() eventBody: EventBody,
    @Res() response: Response,
    @Query() { action }: { action?: string },
  ) {
    if (eventBody.action === undefined) {
      eventBody.action = action;
    }

    const eventResponse = await this.webhookService.handleEvents(
      response,
      sourceName,
      eventHeaders,
      eventBody,
    );
    return eventResponse;
  }

  @Get(':sourceName/:action')
  async webhookEventHandler(
    @Headers() eventHeaders: EventHeaders,
    @Param('sourceName') sourceName: string,
    @Param('action') action: string,
    @Res() response: Response,
    @Query() params: any,
  ) {
    const eventResponse = await this.webhookService.handleEvents(
      response,
      sourceName,
      eventHeaders,
      { action, ...params },
    );
    return eventResponse;
  }
}
