/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';
import { BodyInterface } from 'modules/oauth-callback/oauth-callback.interface';
import {
  WebhookEventBody,
  WebhookEventHeaders,
} from 'modules/webhooks/webhooks.interface';

import { VerifyInstallationBody } from './sentry.interface';
import SentryService from './sentry.service';

@Controller({
  version: '1',
  path: 'sentry',
})
@ApiTags('Sentry')
export class SentryController {
  constructor(private sentryService: SentryService) {}

  @Post()
  async slackEvents(
    @Headers() eventHeaders: WebhookEventHeaders,
    @Body() eventBody: WebhookEventBody,
  ) {
    console.log(JSON.stringify(eventBody), eventHeaders);
    return this.sentryService.handleEvents(eventHeaders, eventBody);
  }

  @Post('redirect_url')
  @UseGuards(new AuthGuard())
  async getRedirectURL(@Body() body: BodyInterface) {
    return await this.sentryService.getRedirectURL(
      body.integrationDefinitionId,
    );
  }

  @Post('callback')
  @UseGuards(new AuthGuard())
  async verifyInstallation(
    @SessionDecorator() session: SessionContainer,
    @Body() installationData: VerifyInstallationBody,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Res() res: any,
  ) {
    const userId = session.getUserId();
    return await this.sentryService.verifyInstallation(
      userId,
      installationData,
      res,
    );
  }
}
