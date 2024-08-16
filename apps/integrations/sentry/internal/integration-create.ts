import axios from 'axios';

import { ProviderTemplate } from '../types';

export const integrationCreate = async (
  userId: string,
  workspaceId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
) => {
  const { oauthResponse, personal, integrationDefinition } = data;
  const spec = integrationDefinition.spec;

  const template: ProviderTemplate = (
    personal ? spec.personal_auth.OAuth2 : spec.workspace_auth.OAuth2
  ) as ProviderTemplate;

  const url = `${template.token_url.replace('${installationId}', oauthResponse.installationId)}`;

  const payload = {
    grant_type: 'authorization_code',
    code: oauthResponse.code,
    client_id: integrationDefinition.clientId,
    client_secret: integrationDefinition.clientSecret,
  };

  const response = await axios.post(url, payload);
  const tokenData = response.data;

  const installationResponse = await axios.put(
    `https://sentry.io/api/0/sentry-app-installations/${oauthResponse.installationId}/`,
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

    const settings = { orgSlug: oauthResponse.orgSlug };
    // Update the integration account with the new configuration in the database
    const integrationAccount = await axios.post(
      `${process.env.BACKEND_HOST}/v1/integration_account`,
      {
        config: integrationConfiguration,
        settings,
        accountId: oauthResponse.installationId,
        userId,
        workspaceId,
        integrationDefinitionId: integrationDefinition.id,
      },
    );

    return {
      message: `Created integration account ${integrationAccount.data.id}`,
    };
  }

  return {
    message: `Cannot verify installation of Tegon app in Sentry`,
  };
};
