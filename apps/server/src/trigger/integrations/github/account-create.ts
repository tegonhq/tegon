import { PrismaClient } from '@prisma/client';
import axios from 'axios';

import { getBotJWTToken, getGithubHeaders } from './utils';

const prisma = new PrismaClient();
export const integrationCreate = async (
  userId: string,
  workspaceId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
) => {
  const { oauthResponse, personal, integrationDefinition, oauthParams } = data;
  const integrationConfiguration = {
    scope: oauthResponse.scope,
    refresh_token: oauthResponse.refresh_token,
    access_token: oauthResponse.access_token,
    client_id: integrationDefinition.clientId,
    client_secret: integrationDefinition.clientSecret,
  };

  let accountId, settings;
  if (personal) {
    const user = await axios
      .get(
        'https://api.github.com/user',
        getGithubHeaders(integrationConfiguration.access_token),
      )
      .then((response) => response.data);

    accountId = user.id.toString();
    settings = { login: user.login };
  } else {
    accountId = oauthParams.installation_id;
    const [org, repos] = await Promise.all([
      axios
        .get(
          `https://api.github.com/app/installations/${accountId}`,
          getGithubHeaders(await getBotJWTToken(integrationDefinition.spec)),
        )
        .then((response) => response.data),
      axios
        .get(
          `https://api.github.com/user/installations/${accountId}/repositories`,
          getGithubHeaders(integrationConfiguration.access_token),
        )
        .then((response) => response.data),
    ]);

    settings = {
      orgAvatarURL: org.account.avatar_url,
      orgLogin: org.account.login,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      repositories: repos?.repositories.map((repo: any) => ({
        id: repo.id.toString(),
        fullName: repo.full_name,
        name: repo.name,
        private: repo.private,
      })),
    };
  }

  // Update the integration account with the new configuration in the database
  const integrationAccount = await prisma.integrationAccount.create({
    data: {
      integrationConfiguration,
      settings,
      accountId,
      integratedById: userId,
      workspaceId,
      integrationDefinitionId: integrationDefinition.id,
    },
  });

  return {
    message: `Created integration account ${integrationAccount.id}`,
  };
};
