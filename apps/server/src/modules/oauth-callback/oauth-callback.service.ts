import { BadRequestException, Injectable } from '@nestjs/common';
import {
  IntegrationEventPayload,
  IntegrationPayloadEventType,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';
import * as simpleOauth2 from 'simple-oauth2';

import { IntegrationDefinitionService } from 'modules/integration-definition/integration-definition.service';
import { LoggerService } from 'modules/logger/logger.service';
import {
  TriggerdevService,
  TriggerProjects,
} from 'modules/triggerdev/triggerdev.service';

import {
  CallbackParams,
  OAuthBodyInterface,
  ProviderTemplateOAuth2,
  SentryCallbackBody,
  SessionRecord,
} from './oauth-callback.interface';
import {
  getSimpleOAuth2ClientConfig,
  getTemplate,
} from './oauth-callback.utils';

const CALLBACK_URL = `${process.env.FRONTEND_HOST}/api/v1/oauth/callback`;

@Injectable()
export class OAuthCallbackService {
  // TODO(Manoj): Move this to Redis once we have multiple servers
  session: Record<string, SessionRecord> = {};
  private readonly logger = new LoggerService(OAuthCallbackService.name);

  constructor(
    private integrationDefinitionService: IntegrationDefinitionService,
    private triggerdevService: TriggerdevService,
    private prisma: PrismaService,
  ) {}

  async getRedirectURL(
    oAuthBody: OAuthBodyInterface,
    userId: string,
    specificScopes?: string,
  ) {
    const { integrationDefinitionId, workspaceId, redirectURL, personal } =
      oAuthBody;

    this.logger.info({
      message: `We got OAuth request for ${workspaceId}: ${integrationDefinitionId}`,
      where: `OAuthCallbackService.getRedirectURL`,
    });

    const integrationDefinition =
      await this.integrationDefinitionService.getIntegrationDefinitionWithSpec(
        integrationDefinitionId,
      );

    const spec = integrationDefinition.spec;
    const externalConfig = personal
      ? spec.personal_auth.OAuth2
      : spec.workspace_auth.OAuth2;
    const template = await getTemplate(integrationDefinition, personal);

    const scopesString = specificScopes || externalConfig.scopes.join(',');
    const additionalAuthParams = template.authorization_params || {};

    try {
      const simpleOAuthClient = new simpleOauth2.AuthorizationCode(
        getSimpleOAuth2ClientConfig(
          {
            client_id: integrationDefinition.clientId,
            client_secret: integrationDefinition.clientSecret,
            scopes: scopesString,
          },
          template,
          externalConfig,
        ),
      );

      const uniqueId = Date.now().toString(36);
      this.session[uniqueId] = {
        integrationDefinitionId: integrationDefinition.id,
        redirectURL,
        workspaceId,
        config: externalConfig,
        userId,
        personal,
      };

      const scopes = [
        ...scopesString.split(','),
        ...(template.default_scopes || []),
      ];

      const authorizationUri = simpleOAuthClient.authorizeURL({
        redirect_uri: CALLBACK_URL,
        scope: scopes.join(template.scope_separator || ' '),
        state: uniqueId,
        ...additionalAuthParams,
      });

      this.logger.debug({
        message: `OAuth 2.0 for ${integrationDefinition.name} - redirecting to: ${authorizationUri}`,
        where: `OAuthCallbackService.getRedirectURL`,
      });

      return {
        status: 200,
        redirectURL: authorizationUri,
      };
    } catch (e) {
      this.logger.warn(e);
      throw new BadRequestException({ error: e.message });
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
      await this.integrationDefinitionService.getIntegrationDefinitionWithSpec(
        sessionRecord.integrationDefinitionId,
      );

    const template = (await getTemplate(
      integrationDefinition,
      sessionRecord.personal,
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
      const scopes = sessionRecord.personal
        ? integrationDefinition.spec.personal_auth.OAuth2.scopes
        : integrationDefinition.spec.workspace_auth.OAuth2.scopes;
      const simpleOAuthClient = new simpleOauth2.AuthorizationCode(
        getSimpleOAuth2ClientConfig(
          {
            client_id: integrationDefinition.clientId,
            client_secret: integrationDefinition.clientSecret,
            scopes: scopes.join(','),
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

      const payload: IntegrationEventPayload = {
        event: IntegrationPayloadEventType.CREATE,
        userId: sessionRecord.userId,
        workspaceId: sessionRecord.workspaceId,
        data: {
          oauthResponse: tokensResponse,
          oauthParams: params,
          integrationDefinition,
          personal: sessionRecord.personal,
        },
      };

      await this.triggerdevService.triggerTask(
        TriggerProjects.Common,
        integrationDefinition.slug,
        payload,
      );

      res.redirect(
        `${sessionRecord.redirectURL}?success=true&integrationName=${integrationDefinition.name}${accountIdentifier}${integrationKeys}`,
      );
    } catch (e) {
      res.redirect(
        `${sessionRecord.redirectURL}?success=false&error=${e.message}${accountIdentifier}${integrationKeys}`,
      );
    }
  }

  async sentryCallbackHandler(
    userId: string,
    callbackData: SentryCallbackBody,
  ) {
    const integrationDefinition =
      await this.integrationDefinitionService.getIntegrationDefinitionWithSpec(
        callbackData.integrationDefinitionId,
      );

    const payload: IntegrationEventPayload = {
      event: IntegrationPayloadEventType.CREATE,
      userId,
      workspaceId: callbackData.workspaceId,
      data: {
        oauthResponse: callbackData,
        integrationDefinition,
        personal: false,
      },
    };

    return await this.triggerdevService.triggerTask(
      TriggerProjects.Common,
      integrationDefinition.name,
      payload,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async emailCallbackHandler(params: CallbackParams, res: any) {
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
      await this.integrationDefinitionService.getIntegrationDefinitionWithId({
        integrationDefinitionId: sessionRecord.integrationDefinitionId,
      });

    const workspace = await this.prisma.workspace.findUnique({
      where: { id: sessionRecord.workspaceId },
    });

    const payload: IntegrationEventPayload = {
      event: IntegrationPayloadEventType.CREATE,
      userId: sessionRecord.userId,
      workspaceId: sessionRecord.workspaceId,
      data: {
        integrationDefinition,
        personal: sessionRecord.personal,
        workspace,
      },
    };

    await this.triggerdevService.triggerTask(
      TriggerProjects.Common,
      integrationDefinition.slug,
      payload,
    );

    const accountIdentifier = sessionRecord.accountIdentifier
      ? `&accountIdentifier=${sessionRecord.accountIdentifier}`
      : '';
    const integrationKeys = sessionRecord.integrationKeys
      ? `&integrationKeys=${sessionRecord.integrationKeys}`
      : '';

    res.redirect(
      `${sessionRecord.redirectURL}?success=true&integrationName=${integrationDefinition.name}${accountIdentifier}${integrationKeys}`,
    );
  }
}
