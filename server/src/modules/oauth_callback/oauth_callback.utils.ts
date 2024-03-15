/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { BadRequestException } from '@nestjs/common';
import { IntegrationDefinition, IntegrationName } from '@prisma/client';

import {
  CallbackParams,
  OAuthAuthorizationMethod,
  OAuthBodyFormat,
  ProviderConfig,
  ProviderTemplate,
  ProviderTemplateOAuth2,
} from './oauth_callback.interface';

/**
 * A helper function to interpolate a string.
 * interpolateString('Hello ${name} of ${age} years", {name: 'Tester', age: 234}) -> returns 'Hello Tester of age 234 years'
 *
 * @remarks
 * Copied from https://stackoverflow.com/a/1408373/250880
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function interpolateString(str: string, replacers: Record<string, any>) {
  return str.replace(/\${([^{}]*)}/g, (a, b) => {
    const r = replacers[b];
    return typeof r === 'string' || typeof r === 'number' ? (r as string) : a; // Typecast needed to make TypeScript happy
  });
}

export function getSimpleOAuth2ClientConfig(
  providerConfig: ProviderConfig,
  template: ProviderTemplate,
  connectionConfig: Record<string, string>,
) {
  const tokenUrl = new URL(
    interpolateString(template.token_url, connectionConfig),
  );
  const authorizeUrl = new URL(
    interpolateString(template.authorization_url, connectionConfig),
  );
  const headers = { 'User-Agent': 'Poozle' };

  const authConfig = template as ProviderTemplateOAuth2;

  return {
    client: {
      id: providerConfig.client_id,
      secret: providerConfig.client_secret,
    },
    auth: {
      tokenHost: tokenUrl.origin,
      tokenPath: tokenUrl.pathname,
      authorizeHost: authorizeUrl.origin,
      authorizePath: authorizeUrl.pathname,
    },
    http: { headers },
    options: {
      authorizationMethod:
        authConfig.authorization_method || OAuthAuthorizationMethod.BODY,
      bodyFormat: authConfig.body_format || OAuthBodyFormat.FORM,
      scopeSeparator: template.scope_separator || ' ',
    },
  };
}

export async function getTemplate(
  integrationDefinition: IntegrationDefinition,
): Promise<ProviderTemplate> {
  const spec =
    typeof integrationDefinition.spec === 'string'
      ? JSON.parse(integrationDefinition.spec)
      : integrationDefinition.spec;

  const template: ProviderTemplate =
    spec.auth_specification.OAuth2 as ProviderTemplate;

  if (!template) {
    throw new BadRequestException({
      error: `This extension doesn't support OAuth. Reach out to us if you need support for this extension`,
    });
  }

  return template;
}

export async function getAccountId(
  integrationName: IntegrationName,
  params: CallbackParams,
  response: any,
): Promise<string> {
  switch (integrationName) {
    case IntegrationName.Github:
      return params.installation_id;

    case IntegrationName.Slack:
      return response.team.id;

    case IntegrationName.GithubPersonal:
      if (response.token.access_token) {
        const accessToken = response.token.access_token;
        const userResponse = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userData = await userResponse.json();
        return userData.id.toString();
      }
      return undefined;

    default:
      return undefined;
  }
}