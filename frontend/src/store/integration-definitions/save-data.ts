import type { IntegrationDefinitionsStoreType } from './store';

import type { SyncActionRecord } from 'common/types/data-loader';

import { tegonDatabase } from 'store/database';

export async function saveIntegrationDefinitionData(
  data: SyncActionRecord[],
  integrationDefinitionsStore: IntegrationDefinitionsStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const integrationDefinition = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        icon: record.data.icon,
        spec: JSON.stringify(record.data.spec),
        scopes: record.data.scopes,
        workspaceId: record.data.workspaceId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.integrationDefinitions.put(integrationDefinition);
          return (
            integrationDefinitionsStore &&
            (await integrationDefinitionsStore.update(
              integrationDefinition,
              record.data.id,
            ))
          );
        }

        case 'U': {
          await tegonDatabase.integrationDefinitions.put(integrationDefinition);
          return (
            integrationDefinitionsStore &&
            (await integrationDefinitionsStore.update(
              integrationDefinition,
              record.data.id,
            ))
          );
        }

        case 'D': {
          await tegonDatabase.integrationDefinitions.delete(record.data.id);
          return (
            integrationDefinitionsStore &&
            (await integrationDefinitionsStore.deleteById(record.data.id))
          );
        }
      }
    }),
  );
}
