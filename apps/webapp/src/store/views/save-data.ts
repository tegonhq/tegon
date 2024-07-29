import type { ViewsStoreType } from './store';
import type { SyncActionRecord } from '@tegonhq/types';

import { tegonDatabase } from 'store/database';

export async function saveViewData(
  data: SyncActionRecord[],
  viewsStore: ViewsStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const view = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        workspaceId: record.data.workspaceId,
        filters: record.data.filters,
        description: record.data.description,
        isBookmarked: record.data.isBookmarked,
        teamId: record.data.teamId,
        createdById: record.data.createdById,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.views.put(view);
          return viewsStore && (await viewsStore.update(view, record.data.id));
        }

        case 'U': {
          await tegonDatabase.views.put(view);
          return viewsStore && (await viewsStore.update(view, record.data.id));
        }

        case 'D': {
          await tegonDatabase.views.delete(record.data.id);
          return viewsStore && (await viewsStore.deleteById(record.data.id));
        }
      }
    }),
  );
}
