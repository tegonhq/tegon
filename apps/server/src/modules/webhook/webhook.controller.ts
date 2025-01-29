import {
  Body,
  Controller,
  Post,
  Headers,
  Param,
  Res,
  Query,
  Get,
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

  @Post('slack/slash')
  async slackSlashEvents(
    @Headers() eventHeaders: EventHeaders,
    @Body() eventBody: EventBody,
  ) {
    const eventResponse = await this.webhookService.slackEvent(
      eventHeaders,
      eventBody,
      'slashCommand',
    );
    return eventResponse;
  }

  @Post('slack/interaction')
  async slackInteractionEvents(
    @Headers() eventHeaders: EventHeaders,
    @Body() eventBody: EventBody,
  ) {
    const eventResponse = await this.webhookService.slackEvent(
      eventHeaders,
      eventBody,

      'interaction',
    );
    return eventResponse;
  }

  @Post(':sourceName')
  async webhookEvents(
    @Headers() eventHeaders: EventHeaders,
    @Param('sourceName') sourceName: string,
    @Body() eventBody: EventBody,
    @Res() response: Response,
    @Query() eventQueryParams: Record<string, string>,
  ) {
    const eventResponse = await this.webhookService.handleEvents(
      response,
      sourceName,
      eventHeaders,
      eventBody,
      eventQueryParams,
    );
    return eventResponse;
  }

  @Get(':sourceName')
  async webhookGetEvents(
    @Headers() eventHeaders: EventHeaders,
    @Param('sourceName') sourceName: string,
    @Query() eventQueryParams: Record<string, string>,
    @Res() response: Response,
  ) {
    const eventResponse = await this.webhookService.handleEvents(
      response,
      sourceName,
      eventHeaders,
      {},
      eventQueryParams,
    );
    return eventResponse;
  }
}
