/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { WorkflowsStoreType } from './store';

import type { SyncActionRecord } from 'common/types/data-loader';

import { tegonDatabase } from 'store/database';

export async function saveWorkflowData(
  data: SyncActionRecord[],
  workflowsStore: WorkflowsStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
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
          return (
            workflowsStore &&
            (await workflowsStore.update(workflow, record.data.id))
          );
        }

        case 'U': {
          await tegonDatabase.workflows.put(workflow);
          return (
            workflowsStore &&
            (await workflowsStore.update(workflow, record.data.id))
          );
        }

        case 'D': {
          await tegonDatabase.workflows.delete(record.data.id);
          return (
            workflowsStore && (await workflowsStore.delete(record.data.id))
          );
        }
      }
    }),
  );
}
