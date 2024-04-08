/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { OAuthCallbackService } from 'modules/oauth-callback/oauth-callback.service';

import { IntegrationAccountQueryParams } from './slack.interface';

@Injectable()
export default class SlackService {
  constructor(
    private prisma: PrismaService,
    private oauthCallbackService: OAuthCallbackService,
  ) {}

  async getChannelRedirectURL(
    integrationAccountQueryParams: IntegrationAccountQueryParams,
    redirectURL: string,
    userId: string,
  ) {
    const integrationAccount = await this.prisma.integrationAccount.findUnique({
      where: { id: integrationAccountQueryParams.integrationAccountId },
      include: { integrationDefinition: true },
    });

    return await this.oauthCallbackService.getRedirectURL(
      integrationAccount.workspaceId,
      integrationAccount.integrationDefinitionId,
      redirectURL,
      userId,
      'incoming-webhook',
    );
  }
}
