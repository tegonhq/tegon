import { PrismaClient } from '@prisma/client';

import { getSlackTeamInfo } from './utils';

const prisma = new PrismaClient();
export const integrationCreate = async (
  userId: string,
  workspaceId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
) => {
  const { oauthResponse, personal, integrationDefinition } = data;
  const integrationConfiguration = {
    api_key: oauthResponse.access_token,
  };

  const accountId = !personal
    ? oauthResponse.team.id
    : oauthResponse.authed_user.id;

  const slackTeamInfo = await getSlackTeamInfo(
    accountId,
    integrationConfiguration.api_key,
  );

  const settings = personal
    ? {}
    : {
        teamId: oauthResponse.team.id as string,
        teamName: oauthResponse.team.name as string,
        teamDomain: slackTeamInfo.team.domain,
        teamUrl: slackTeamInfo.team.url,
        botUserId: oauthResponse.bot_user_id,
      };

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
