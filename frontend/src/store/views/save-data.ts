/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { ViewsStoreType } from './store';

import type { SyncActionRecord } from 'common/types/data-loader';

import { tegonDatabase } from 'store/database';

export async function saveTeamData(
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
        isFavorite: record.data.isFavorite,
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
