import type { ActionsStoreType } from './store';

import type { SyncActionRecord } from 'common/types';

import { tegonDatabase } from 'store/database';

export async function saveActionData(
  data: SyncActionRecord[],
  actionsStore: ActionsStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const action = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        createdById: record.data.createdById,
        workspaceId: record.data.workspaceId,

        status: record.data.status,
        version: record.data.version,
        name: record.data.name,
        description: record.data.description,
        slug: record.data.slug,
        isPersonal: record.data.isPersonal,

        integrations: record.data.integrations,
        data: JSON.stringify(record.data.data),
        cron: record.data.cron,
        config: JSON.stringify(record.data.config),
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.actions.put(action);
          return (
            actionsStore && (await actionsStore.update(action, record.data.id))
          );
        }

        case 'U': {
          await tegonDatabase.actions.put(action);
          return (
            actionsStore && (await actionsStore.update(action, record.data.id))
          );
        }

        case 'D': {
          await tegonDatabase.actions.delete(record.data.id);
          return (
            actionsStore && (await actionsStore.deleteById(record.data.id))
          );
        }
      }
    }),
  );
}
