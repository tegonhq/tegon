/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { saveLabelData } from 'store/label';
import { saveWorkspaceData } from 'store/workspace';

import { SyncActionRecord } from './types/data-loader';

// Saves the data from the socket and call explicitly functions from individual models
export async function saveSocketData(data: SyncActionRecord[]) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      if (record.modelName === 'Label') {
        return await saveLabelData({
          syncActions: [record],
          lastSequenceId: record.sequenceId,
        });
      }

      return await saveWorkspaceData({
        syncActions: [record],
        lastSequenceId: record.sequenceId,
      });
    }),
  );
}
