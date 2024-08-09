import { IntegrationAccount } from '@tegonhq/types';
import axios from 'axios';

import { postRequest } from '../integration.utils';

export async function getAccessToken(integrationAccount: IntegrationAccount) {
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

    const { data } = await axios.post(url, payload);

    const tokens = new URLSearchParams(data);

    config.refresh_token = tokens.get('refreshToken');

    config.access_token = tokens.get('token');
    config.access_expires_in = tokens.get('expiresAt');

    // Update the integration account with the new configuration in the database
    await axios.post(
      `${process.env.BACKEND_HOST}/v1/integration_account/${integrationAccount.id}`,
      { integrationConfiguration: config },
    );
  }

  return config.access_token;
}

export async function getSentryHeaders(integrationAccount: IntegrationAccount) {
  const sentryAccessToken = await getAccessToken(integrationAccount);
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sentryAccessToken}`,
    },
  };
}

export async function getSentryIssue(
  integrationAccount: IntegrationAccount,
  orgSlug: string,
  issueId: string,
) {
  const url = `https://sentry.io/api/0/organizations/${orgSlug}/issues/${issueId}/`;
  return await axios.get(url, await getSentryHeaders(integrationAccount));
}

export async function createSentryComment(
  integrationAccount: IntegrationAccount,
  issueId: string,
  comment: string,
) {
  const url = `https://sentry.io/api/0/issues/${issueId}/comments/`;

  const headers = await getSentryHeaders(integrationAccount);

  const payload = {
    text: comment,
  };

  return await postRequest(url, headers, payload);
}
