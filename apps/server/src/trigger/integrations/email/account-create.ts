import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const integrationCreate = async (
  userId: string,
  workspaceId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
) => {
  const { oauthResponse, integrationDefinition, workspace } = data;
  const integrationConfiguration = {
    refreshToken: oauthResponse.refreshToken,
    redirectUrl: oauthResponse.redirectUrl,
  };

  const accountId = workspace.slug;

  // Update the integration account with the new configuration in the database
  const integrationAccount = await prisma.integrationAccount.create({
    data: {
      integrationConfiguration,
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
