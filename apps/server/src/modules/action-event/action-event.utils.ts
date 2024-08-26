import { ActionEntity, IntegrationAccount } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

export async function getIntegrationAccountsFromActions(
  prisma: PrismaService,
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
        slug: {
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
      [curr.integrationDefinition.slug]: curr,
    }),
    {},
  );
}
