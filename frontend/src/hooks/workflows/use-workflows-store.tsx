/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type {
  BootstrapResponse,
  SyncActionRecord,
} from 'common/types/data-loader';

import { useStoreManagement } from 'hooks/use-store-management';

import { tegonDatabase } from 'store/database';
import { MODELS } from 'store/models';
import { workflowsStore } from 'store/workflows';

export async function saveWorkflowData(data: BootstrapResponse) {
  await Promise.all(
    data.syncActions.map(async (record: SyncActionRecord) => {
      const workflow = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        name: record.data.name,
        position: record.data.position,
        workflowId: record.data.teamId,
        color: record.data.color,
        category: record.data.category,
        teamId: record.data.teamId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.workflows.put(workflow);
          return await workflowsStore.update(workflow, record.data.id);
        }

        case 'U': {
          await tegonDatabase.workflows.put(workflow);
          return await workflowsStore.update(workflow, record.data.id);
        }

        case 'D': {
          await tegonDatabase.workflows.delete(record.data.id);
          return await workflowsStore.delete(record.data.id);
        }
      }
    }),
  );

  await tegonDatabase.sequences.put({
    id: MODELS.Workflow,
    lastSequenceId: data.lastSequenceId,
  });
}

export function useWorkflowsStore() {
  return useStoreManagement({
    modelName: MODELS.Workflow,
    onSaveData: saveWorkflowData,
    store: workflowsStore,
  });
}
