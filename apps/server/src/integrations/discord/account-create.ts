import { PrismaClient } from '@prisma/client';
import { createIntegrationAccount } from 'integrations/utils';

const prisma = new PrismaClient();
export const integrationCreate = async (
  userId: string,
  workspaceId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
) => {
  const { oauthResponse, integrationDefinition } = data;

  const integrationConfiguration = {
    access_token: oauthResponse.access_token,
    refresh_token: oauthResponse.refresh_token,
  };

  const accountId = oauthResponse.guild.id;

  const settings = {
    name: oauthResponse.guild.name,
    owner_id: oauthResponse.guild.owner_id,
    system_channel_id: oauthResponse.system_channel_id,
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
    message: `Created integration account ${integrationAccount.id}`,
  };
};
