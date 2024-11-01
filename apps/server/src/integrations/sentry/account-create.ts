import { PrismaClient } from '@prisma/client';
import { createIntegrationAccount } from 'integrations/utils';
import { IntegrationEventPayload } from '@tegonhq/types';
import { SentryCallbackBody, SentryTokenResponseData } from './types';
import axios from 'axios';

const prisma = new PrismaClient();

export const integrationCreate = async (
  userId: string,
  workspaceId: string,
  data: IntegrationEventPayload,
) => {
  const { oauthResponse, integrationDefinition } = data;

  const { code, installationId, orgSlug } = oauthResponse as SentryCallbackBody;

  const requestData = {
    grant_type: 'authorization_code',
    code,
    client_id: process.env.SENTRY_CLIENT_ID,
    client_secret: process.env.SENTRY_CLIENT_SECRET,
  };

  // get access and refresh token
  const tokenResponse: { data: SentryTokenResponseData } = await axios.post(
    `https://sentry.io/api/0/sentry-app-installations/${installationId}/authorizations/`,
    requestData,
  );

  // set active status of installation
  const verificationResponse = await axios.put(
    `https://sentry.io/api/0/sentry-app-installations/${installationId}/`,
    { status: 'installed' },
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.token}`,
      },
    },
  );

  const appSlug = verificationResponse.data.app.slug;

  const integrationConfiguration = {
    accessToken: tokenResponse.data.token,
    refreshToken: tokenResponse.data.refreshToken,
    orgSlug,
  };

  const accountId = oauthResponse.installationId as string;

  const settings = {
    code: oauthResponse.code,
  };

  // Update the integration account with the new configuration in the database
  const integrationAccount = await createIntegrationAccount(prisma, {
    settings,
    userId,
    accountId,
    config: integrationConfiguration,
    workspaceId,
    integrationDefinitionId: integrationDefinition.id,
  });

  return {
    status: true,
    message: `Created integration account ${integrationAccount.id}`,
    orgSlug,
    appSlug,
  };
};
