/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { Specification } from 'modules/integration-definition/integration-definition.interface';
import { SessionRecord } from 'modules/oauth-callback/oauth-callback.interface';

import { IntegrationAccountQueryParams } from './slack.interface';

@Injectable()
export default class SlackService {
  session: Record<string, SessionRecord> = {};
  constructor(private prisma: PrismaService) {}

  async getChannelRedirectURL(
    integrationAccountQueryParams: IntegrationAccountQueryParams,
    redirectURL: string,
    userId: string,
  ) {
    const integrationAccount = await this.prisma.integrationAccount.findUnique({
      where: { id: integrationAccountQueryParams.integrationAccountId },
      include: { integrationDefinition: true },
    });

    const integrationDefinition = integrationAccount.integrationDefinition;
    const spec = integrationDefinition.spec as unknown as Specification;

    const channelURL = spec.auth_specification.channel_url;
    const stateId = new Date().getTime().toString(36);
    this.session[stateId] = {
      integrationDefinitionId: integrationDefinition.id,
      redirectURL,
      workspaceId: integrationAccount.workspaceId,
      userId,
      config: {},
    };

    return `${channelURL}?scope=incoming-webhook&client_id=${integrationDefinition.clientId}&redirect_uri=${process.env.PUBLIC_FRONTEND_HOST}/api/v1/slack/callback&state=${stateId}`;
  }
}
