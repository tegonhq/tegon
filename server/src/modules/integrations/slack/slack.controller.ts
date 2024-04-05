/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

import { ChannelBody, IntegrationAccountQueryParams } from './slack.interface';
import SlackService from './slack.service';

@Controller({
  version: '1',
  path: 'slack',
})
@ApiTags('slack')
export class LabelsController {
  constructor(private slackService: SlackService) {}

  @Post('')
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

  @Post('channel/callback')
  async channelCallBack() {}
}
