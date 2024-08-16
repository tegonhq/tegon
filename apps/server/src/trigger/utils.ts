import { PrismaClient } from '@prisma/client';
import {
  ActionEntity,
  ActionTypesEnum,
  IntegrationAccount,
} from '@tegonhq/types';

export function convertToActionType(action: string): ActionTypesEnum {
  switch (action.toLowerCase()) {
    case 'insert':
      return ActionTypesEnum.OnCreate;
    case 'update':
      return ActionTypesEnum.OnUpdate;
    case 'delete':
      return ActionTypesEnum.OnDelete;
  }

  return null;
}

export async function getIntegrationAccountsFromActions(
  prisma: PrismaClient,
  workspaceId: string,
  actionEntities: ActionEntity[],
): Promise<Record<string, IntegrationAccount>> {
  const uniqueIntegrations = [
    ...new Set(
      actionEntities.flatMap(
        (actionEntity: ActionEntity) => actionEntity.action.integrations,
      ),
    ),
  ];

  const integrationAccounts = await prisma.integrationAccount.findMany({
    where: {
      integrationDefinition: {
        name: {
          in: uniqueIntegrations,
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
      [curr.integrationDefinition.name]: curr,
    }),
    {},
  );
}
