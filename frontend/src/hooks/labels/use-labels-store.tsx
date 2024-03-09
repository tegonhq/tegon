/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type {
  BootstrapResponse,
  SyncActionRecord,
} from 'common/types/data-loader';

import { useStoreManagement } from 'hooks/use-store-management';

import { tegonDatabase } from 'store/database';
import { labelsStore } from 'store/labels';
import { MODELS } from 'store/models';

export async function saveLabelData(data: BootstrapResponse) {
  await Promise.all(
    data.syncActions.map(async (record: SyncActionRecord) => {
      const label = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        color: record.data.color,
        description: record.data.description,
        workspaceId: record.data.workspaceId,
        teamId: record.data.teamId,
        groupId: record.data.groupId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.labels.put(label);
          return await labelsStore.update(label, record.data.id);
        }

        case 'U': {
          await tegonDatabase.labels.put(label);
          return await labelsStore.update(label, record.data.id);
        }

        case 'D': {
          await tegonDatabase.labels.delete(record.data.id);
          return await labelsStore.delete(record.data.id);
        }
      }
    }),
  );

  await tegonDatabase.sequences.put({
    id: MODELS.Label,
    lastSequenceId: data.lastSequenceId,
  });
}

export function useLabelsStore() {
  return useStoreManagement({
    store: labelsStore,
    modelName: MODELS.Label,
    onSaveData: saveLabelData,
  });
}
