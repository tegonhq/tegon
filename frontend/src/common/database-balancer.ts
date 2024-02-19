/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { saveLabelData } from 'store/label';
import { saveTeamData } from 'store/team';
import { saveWorkflowData } from 'store/workflow';
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

      if (record.modelName === 'Team') {
        return await saveTeamData({
          syncActions: [record],
          lastSequenceId: record.sequenceId,
        });
      }

      if (record.modelName === 'Workflow') {
        return await saveWorkflowData({
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
