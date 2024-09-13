import {
  IntegrationAccount,
  IntegrationPayloadEventType,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { generateKeyForUserId } from 'common/authentication';

import { IntegrationsService } from 'modules/integrations/integrations.service';

export async function getIntegrationAccountsFromActions(
  prisma: PrismaService,
  integrationsService: IntegrationsService,
  workspaceId: string,
  integrations: string[],
  personal: boolean,
): Promise<Record<string, IntegrationAccount>> {
  const integrationAccounts = await prisma.integrationAccount.findMany({
    where: {
      personal,
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
      const token = await integrationsService.loadIntegration(
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
  integrationsService: IntegrationsService,
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

  // Created by id is taken for both dev and personal deployed actions
  const userId = actionUser?.userId ?? action.createdById;
  const accessToken = await generateKeyForUserId(userId);

  const integrationMap = await getIntegrationAccountsFromActions(
    prisma,
    integrationsService,
    action.workspaceId,
    action.integrations,
    action.isPersonal,
  );

  return {
    integrationAccounts: Object.fromEntries(
      action.integrations.map((integrationName) => [
        integrationName,
        integrationMap[integrationName],
      ]),
    ),
    userId,
    accessToken,
    action,
  };
};
