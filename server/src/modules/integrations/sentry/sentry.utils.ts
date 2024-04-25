/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { PrismaService } from 'nestjs-prisma';

import { IntegrationAccountWithRelations } from 'modules/integration-account/integration-account.interface';

import { getRequest, postRequest } from '../integrations.utils';

export async function getAccessToken(
  prisma: PrismaService,
  integrationAccount: IntegrationAccountWithRelations,
) {
  const config = integrationAccount.integrationConfiguration as Record<
    string,
    string
  >;
  const currentDate = Date.now();
  const accessExpiresIn = Date.parse(config.access_expires_in);

  if (!accessExpiresIn || currentDate >= accessExpiresIn) {
    const { client_id, client_secret, refresh_token } = config;

    const url = `https://sentry.io/api/0/sentry-app-installations/${integrationAccount.accountId}/authorizations/`;

    const payload = {
      grant_type: 'refresh_token',
      refresh_token,
      client_id,
      client_secret,
    };

    const { data } = await postRequest(url, { headers: {} }, payload);

    const tokens = new URLSearchParams(data);

    config.refresh_token = tokens.get('refreshToken');

    config.access_token = tokens.get('token');
    config.access_expires_in = tokens.get('expiresAt');

    await prisma.integrationAccount.update({
      where: { id: integrationAccount.id },
      data: { integrationConfiguration: config },
    });
  }

  return config.access_token;
}

export async function getSentryHeaders(
  prisma: PrismaService,
  integrationAccount: IntegrationAccountWithRelations,
) {
  const accessToken = await getAccessToken(prisma, integrationAccount);
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

export async function getSentryIssue(
  prisma: PrismaService,
  integrationAccount: IntegrationAccountWithRelations,
  orgSlug: string,
  issueId: string,
) {
  const url = `https://sentry.io/api/0/organizations/${orgSlug}/issues/${issueId}/`;
  return await getRequest(
    url,
    await getSentryHeaders(prisma, integrationAccount),
  );
}

export async function createSentryComment(
  prisma: PrismaService,
  integrationAccount: IntegrationAccountWithRelations,
  issueId: string,
  comment: string,
) {
  const url = `https://sentry.io/api/0/issues/${issueId}/comments/`;

  const headers = await getSentryHeaders(prisma, integrationAccount);

  const payload = {
    text: comment,
  };

  return await postRequest(url, headers, payload);
}
