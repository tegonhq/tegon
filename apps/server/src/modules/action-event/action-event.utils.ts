import { IntegrationAccount } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { generateKeyForUserId } from 'common/authentication';

export async function getIntegrationAccountsFromActions(
  prisma: PrismaService,
  workspaceId: string,
  integrations: string[],
): Promise<Record<string, IntegrationAccount>> {
  const integrationAccounts = await prisma.integrationAccount.findMany({
    where: {
      integrationDefinition: {
        slug: {
          in: integrations,
        },
      },
      workspaceId,
      deleted: null,
    },
    include: { integrationDefinition: true, workspace: true },
  });

  return integrationAccounts.reduce(
    (acc, curr: IntegrationAccount) => ({
      ...acc,
      [curr.integrationDefinition.slug]: curr,
    }),
    {},
  );
}

export const prepareTriggerPayload = async (
  prisma: PrismaService,
  actionId: string,
) => {
  const action = await prisma.action.findFirst({
    where: {
      id: actionId,
    },
  });

  const actionUser = await prisma.user.findFirst({
    where: { username: action.slug },
  });

  const accessToken = await generateKeyForUserId(actionUser.id);

  const integrationMap = await getIntegrationAccountsFromActions(
    prisma,
    action.workspaceId,
    action.integrations,
  );

  return {
    integrationAccounts: Object.fromEntries(
      action.integrations.map((integrationName) => [
        integrationName,
        integrationMap[integrationName],
      ]),
    ),
    accessToken,
    action,
  };
};
