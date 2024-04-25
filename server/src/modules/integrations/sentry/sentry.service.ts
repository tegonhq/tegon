/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable, Logger } from '@nestjs/common';
import { IntegrationName } from '@prisma/client';
import axios from 'axios';
import { PrismaService } from 'nestjs-prisma';

import { CreateIntegrationAccountBody } from 'modules/integration-account/integration-account.interface';
import { IntegrationAccountService } from 'modules/integration-account/integration-account.service';
import { getTemplate } from 'modules/oauth-callback/oauth-callback.utils';
import { WebhookEventBody } from 'modules/webhooks/webhooks.interface';

import { VerifyInstallationBody } from './sentry.interface';
import { EventHeaders } from '../integrations.interface';

@Injectable()
export default class SentryService {
  constructor(
    private prisma: PrismaService,
    private integrationAccountService: IntegrationAccountService,
  ) {}
  private readonly logger = new Logger('Sentry');

  async getRedirectURL(integrationDefinitionId: string) {
    const integrationDefinition =
      await this.prisma.integrationDefinition.findUnique({
        where: { id: integrationDefinitionId },
      });

    this.logger.log('In sentry redirectURl');
    console.log(integrationDefinition);
    const template = await getTemplate(integrationDefinition);

    return { status: 200, redirectURL: template.authorization_url };
  }

  //   `${process.env.PUBLIC_FRONTEND_HOST}/auth/callback/sentry`
  async verifyInstallation(
    userId: string,
    installationData: VerifyInstallationBody,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res: any,
  ) {
    console.log(installationData);
    const integrationDefinition =
      await this.prisma.integrationDefinition.findFirst({
        where: {
          workspaceId: installationData.workspaceId,
          name: IntegrationName.Sentry,
        },
      });

    if (integrationDefinition === null) {
      const errorMessage = 'No matching integration definition found';

      res.redirect(
        `${installationData.redirectURL}?success=false&error=${errorMessage}`,
      );
    }

    const template = await getTemplate(integrationDefinition);

    const url = `${template.token_url.replace('${installationId}', installationData.installationId)}`;

    const payload = {
      grant_type: 'authorization_code',
      code: installationData.code,
      client_id: integrationDefinition.clientId,
      client_secret: integrationDefinition.clientSecret,
    };

    try {
      const response = await axios.post(url, payload);
      const tokenData = response.data;

      const installationResponse = await axios.put(
        `https://sentry.io/api/0/sentry-app-installations/${installationData.installationId}/`,
        {
          status: 'installed',
        },
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        },
      );
      if (installationResponse.data.status === 'installed') {
        const integrationConfiguration = {
          scope: tokenData.scopes.join(','),
          refresh_token: tokenData.refreshToken,
          access_token: tokenData.token,
          client_id: integrationDefinition.clientId,
          client_secret: integrationDefinition.clientSecret,
          access_expires_in: tokenData.expiresAt,
        };
        await this.integrationAccountService.createIntegrationAccount({
          integrationDefinitionId: integrationDefinition.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          config: integrationConfiguration as any,
          workspaceId: installationData.workspaceId,
          accountId: installationData.installationId,
          userId,
          settings: {
            [IntegrationName.Sentry]: { orgSlug: installationData.orgSlug },
          },
        } as CreateIntegrationAccountBody);

        res.redirect(
          `${installationData.redirectURL}?success=true&integrationName=${integrationDefinition.name}`,
        );
      } else {
        res.redirect(
          `${installationData.redirectURL}?success=false&integrationName=${integrationDefinition.name}`,
        );
      }
    } catch (e) {
      res.redirect(
        `${installationData.redirectURL}?success=false&integrationName=${integrationDefinition.name}&error=${e.message}`,
      );
    }
  }

  async handleEvents(eventHeaders: EventHeaders, eventBody: WebhookEventBody) {
    const hookType = eventHeaders['sentry-hook-resource'];
    this.logger.debug(
      `Received Sentry webhook event with hook type: ${hookType}`,
    );
    if (hookType === 'installation' && eventBody.action === 'deleted') {
      this.logger.log(
        `Handling Sentry installation deleted event for account ID: ${eventBody.installation.uuid}`,
      );
      const result = await this.prisma.integrationAccount.updateMany({
        where: { accountId: eventBody.installation.uuid },
        data: { isActive: false, deleted: new Date().toISOString() },
      });
      this.logger.log(
        `Updated ${result.count} integration account(s) for deleted Sentry installation`,
      );
      return result;
    }
    this.logger.log('Ignoring unhandled Sentry webhook event');
    return undefined;
  }
}
