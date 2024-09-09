import {
  IntegrationAccount,
  IntegrationPayloadEventType,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { generateKeyForUserId } from 'common/authentication';

import {
  TriggerdevService,
  TriggerProjects,
} from 'modules/triggerdev/triggerdev.service';

export async function getIntegrationAccountsFromActions(
  prisma: PrismaService,
  triggerDevService: TriggerdevService,
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
    include: {
      integrationDefinition: {
        select: {
          id: true,
          slug: true,
          name: true,
          config: true,
          createdAt: true,
          updatedAt: true,
          deleted: true,
          description: true,
          icon: true,
        },
      },
      workspace: true,
    },
  });

  const updatedIntegrationAccount = await Promise.all(
    integrationAccounts.map(async (integrationAccount) => {
      const token = await triggerDevService.triggerTask(
        TriggerProjects.Common,
        integrationAccount.integrationDefinition.slug,
        {
          event: IntegrationPayloadEventType.GET_TOKEN,
          workspaceId: integrationAccount.workspaceId,
          integrationAccountId: integrationAccount.id,
        },
      );

      return { ...integrationAccount, integrationConfiguration: token };
    }),
  );

  return updatedIntegrationAccount.reduce(
    (acc, curr: IntegrationAccount) => ({
      ...acc,
      [curr.integrationDefinition.slug]: curr,
    }),
    {},
  );
}

export const prepareTriggerPayload = async (
  prisma: PrismaService,
  triggerDevService: TriggerdevService,
  actionId: string,
) => {
  const action = await prisma.action.findUnique({
    where: {
      id: actionId,
    },
  });

  const actionUser = await prisma.usersOnWorkspaces.findFirst({
    where: { workspaceId: action.workspaceId, user: { username: action.slug } },
  });

  const accessToken = await generateKeyForUserId(actionUser.userId);

  const integrationMap = await getIntegrationAccountsFromActions(
    prisma,
    triggerDevService,
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
    userId: actionUser.id,
    accessToken,
    action,
  };
};
