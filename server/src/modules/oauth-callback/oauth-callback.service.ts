/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { IntegrationDefinition } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import * as simpleOauth2 from 'simple-oauth2';

import { CreateIntegrationAccountBody } from 'modules/integration-account/integration-account.interface';
import { IntegrationAccountService } from 'modules/integration-account/integration-account.service';

import {
  CallbackParams,
  ProviderTemplateOAuth2,
  SessionRecord,
} from './oauth-callback.interface';
import {
  getAccountId,
  getSimpleOAuth2ClientConfig,
  getTemplate,
} from './oauth-callback.utils';

// const CALLBACK_URL = `${process.env.PUBLIC_FRONTEND_HOST}/api/v1/oauth/callback`;
const CALLBACK_URL = `https://e085-2406-7400-63-6077-6c38-d7b3-bf50-f146.ngrok-free.app/v1/oauth/callback`;

@Injectable()
export class OAuthCallbackService {
  session: Record<string, SessionRecord> = {};
  private readonly logger = new Logger(OAuthCallbackService.name);

  constructor(
    private prisma: PrismaService,
    private integrationAccountService: IntegrationAccountService,
  ) {}

  async getIntegrationDefinition(integrationDefinitionId: string) {
    let integrationDefinition: IntegrationDefinition;

    try {
      integrationDefinition =
        await this.prisma.integrationDefinition.findUnique({
          where: { id: integrationDefinitionId },
        });
    } catch (e) {
      throw new BadRequestException({
        error: 'No integrations found',
      });
    }

    if (!integrationDefinition) {
      throw new BadRequestException({
        error: 'No integration defnition found',
      });
    }

    return integrationDefinition;
  }

  async getRedirectURL(
    workspaceId: string,
    integrationDefinitionId: string,
    redirectURL: string,
    userId: string,
  ) {
    this.logger.log(
      `We got OAuth request for ${workspaceId}: ${integrationDefinitionId}`,
    );

    const integrationDefinition = await this.getIntegrationDefinition(
      integrationDefinitionId,
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spec = integrationDefinition.spec as Record<string, any>;
    const externalConfig = spec.auth_specification['OAuth2'];
    const template = await getTemplate(integrationDefinition);

    let additionalAuthParams: Record<string, string> = {};
    if (template.authorization_params) {
      additionalAuthParams = template.authorization_params;
    }

    try {
      const simpleOAuthClient = new simpleOauth2.AuthorizationCode(
        getSimpleOAuth2ClientConfig(
          {
            client_id: integrationDefinition.clientId,
            client_secret: integrationDefinition.clientSecret,
            scopes: integrationDefinition.scopes,
          },
          template,
          externalConfig,
        ),
      );

      const uniqueId = new Date().getTime().toString(36);
      this.session[uniqueId] = {
        integrationDefinitionId: integrationDefinition.id,
        redirectURL,
        workspaceId,
        config: externalConfig,
        userId,
      };

      let scopes = integrationDefinition.scopes.split(',');

      if (template.default_scopes) {
        scopes = scopes.concat(template.default_scopes);
      }

      const authorizationUri = simpleOAuthClient.authorizeURL({
        redirect_uri: CALLBACK_URL,
        scope: scopes.join(template.scope_separator || ' '),
        state: uniqueId,
        ...additionalAuthParams,
      });

      this.logger.debug(
        `OAuth 2.0 for ${integrationDefinition.name} - redirecting to: ${authorizationUri}`,
      );

      return {
        status: 200,
        redirectURL: authorizationUri,
      };
    } catch (e) {
      console.warn(e);
      throw new BadRequestException({
        error: e.message,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async callbackHandler(params: CallbackParams, res: any) {
    if (!params.state) {
      throw new BadRequestException({
        error: 'No state found',
      });
    }

    const sessionRecord = this.session[params.state];

    /**
     * Delete the session once it's used
     */
    delete this.session[params.state];

    if (!sessionRecord) {
      throw new BadRequestException({
        error: 'No session found',
      });
    }

    const integrationDefinition =
      await this.prisma.integrationDefinition.findUnique({
        where: { id: sessionRecord.integrationDefinitionId },
      });

    const template = (await getTemplate(
      integrationDefinition,
    )) as ProviderTemplateOAuth2;

    if (integrationDefinition === null) {
      const errorMessage = 'No matching integration definition found';

      res.redirect(
        `${sessionRecord.redirectURL}?success=false&error=${errorMessage}`,
      );
    }

    let additionalTokenParams: Record<string, string> = {};
    if (template.token_params !== undefined) {
      const deepCopy = JSON.parse(JSON.stringify(template.token_params));
      additionalTokenParams = deepCopy;
    }

    if (template.refresh_params) {
      additionalTokenParams = template.refresh_params;
    }

    const headers: Record<string, string> = {};

    if (template.token_request_auth_method === 'basic') {
      headers['Authorization'] = `Basic ${Buffer.from(
        `${integrationDefinition.clientId}:${integrationDefinition.clientSecret}`,
      ).toString('base64')}`;
    }

    const accountIdentifier = sessionRecord.accountIdentifier
      ? `&accountIdentifier=${sessionRecord.accountIdentifier}`
      : '';
    const integrationKeys = sessionRecord.integrationKeys
      ? `&integrationKeys=${sessionRecord.integrationKeys}`
      : '';

    try {
      const simpleOAuthClient = new simpleOauth2.AuthorizationCode(
        getSimpleOAuth2ClientConfig(
          {
            client_id: integrationDefinition.clientId,
            client_secret: integrationDefinition.clientSecret,
            scopes: integrationDefinition.scopes,
          },
          template,
          sessionRecord.config,
        ),
      );

      // const {code, ...otherParams} = params
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tokensResponse: any = await simpleOAuthClient.getToken(
        {
          code: params.code as string,
          redirect_uri: CALLBACK_URL,
          ...additionalTokenParams,
        },
        {
          headers,
        },
      );
      let integrationConfiguration;

      const accountId = await getAccountId(
        integrationDefinition.name,
        params,
        tokensResponse,
      );
      if (
        tokensResponse.token.access_token &&
        tokensResponse.token.refresh_token
      ) {
        integrationConfiguration = {
          // ...otherParams,
          scope: tokensResponse.token.scope,
          refresh_token: tokensResponse.token.refresh_token,
          access_token: tokensResponse.token.access_token,
          client_id: integrationDefinition.clientId,
          client_secret: integrationDefinition.clientSecret,
        };
      } else {
        integrationConfiguration = {
          // ...otherParams,
          api_key: tokensResponse.token.access_token,
        };
      }

      await this.integrationAccountService.createIntegrationAccount({
        integrationDefinitionId: integrationDefinition.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config: integrationConfiguration as any,
        workspaceId: sessionRecord.workspaceId,
        accountId,
        userId: sessionRecord.userId,
      } as CreateIntegrationAccountBody);

      res.redirect(
        `${sessionRecord.redirectURL}?success=true&integrationName=${integrationDefinition.name}${accountIdentifier}${integrationKeys}`,
      );
    } catch (e) {
      res.redirect(
        `${sessionRecord.redirectURL}?success=false&error=${e.message}${accountIdentifier}${integrationKeys}`,
      );
    }
  }
}
