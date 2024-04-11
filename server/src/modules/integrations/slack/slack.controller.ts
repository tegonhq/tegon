/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Body,
  Controller,
  Post,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';
import {
  WebhookEventBody,
  WebhookEventHeaders,
} from 'modules/webhooks/webhooks.interface';

import { ChannelBody, IntegrationAccountQueryParams } from './slack.interface';
import SlackService from './slack.service';
import { EventBody, EventHeaders } from '../integrations.interface';

@Controller({
  version: '1',
  path: 'slack',
})
@ApiTags('slack')
export class SlackController {
  constructor(private slackService: SlackService) {}

  @Post()
  async slackEvents(
    @Headers() _eventHeaders: WebhookEventHeaders,
    @Body() eventBody: WebhookEventBody,
  ) {
    return await this.slackService.handleEvents(eventBody);
  }

  @Post('channel/redirect')
  @UseGuards(new AuthGuard())
  async channelRedirectURL(
    @SessionDecorator() session: SessionContainer,
    @Query() integrationAccountQueryParams: IntegrationAccountQueryParams,
    @Body() body: ChannelBody,
  ) {
    const userId = session.getUserId();
    return await this.slackService.getChannelRedirectURL(
      integrationAccountQueryParams,
      body.redirectURL,
      userId,
    );
  }

  @Post('slash_command')
  async slashCommand(
    @Headers() _eventHeaders: EventHeaders,
    @Body() eventBody: EventBody,
  ) {
    this.slackService.slashOpenModal(
      eventBody.team_id,
      eventBody.channel_id,
      eventBody.trigger_id,
      eventBody.token,
      eventBody.team_domain,
    );
  }

  @Post('interactions')
  async handleInteractions(
    @Headers() _eventHeaders: WebhookEventHeaders,
    @Body() eventBody: WebhookEventBody,
  ) {
    const payload = JSON.parse(eventBody.payload);
    if (payload.type === 'view_submission') {
      return await this.slackService.handleViewSubmission(
        payload.token,
        payload,
      );
    }
    return { status: 200 };
  }
}
