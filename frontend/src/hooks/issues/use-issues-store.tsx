/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type {
  BootstrapResponse,
  SyncActionRecord,
} from 'common/types/data-loader';

import { useStoreManagement } from 'hooks/use-store-management';

import { tegonDatabase } from 'store/database';
import { issuesStore } from 'store/issues';
import { MODELS } from 'store/models';

export async function saveIssuesData(data: BootstrapResponse) {
  await Promise.all(
    data.syncActions.map(async (record: SyncActionRecord) => {
      const issue = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        title: record.data.title,
        number: record.data.number,
        description: record.data.description,
        priority: record.data.priority,
        dueDate: record.data.dueDate,
        sortOrder: record.data.sortOrder,
        estimate: record.data.estimate,
        teamId: record.data.teamId,
        createdById: record.data.createdById,
        assigneeId: record.data.assigneeId,
        labelIds: record.data.labelIds,
        parentId: record.data.parentId,
        stateId: record.data.stateId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.issues.put(issue);
          return await issuesStore.update(issue, record.data.id);
        }

        case 'U': {
          await tegonDatabase.issues.put(issue);
          return await issuesStore.update(issue, record.data.id);
        }

        case 'D': {
          await tegonDatabase.issues.delete(record.data.id);
          return await issuesStore.delete(record.data.id);
        }
      }
    }),
  );

  await tegonDatabase.sequences.put({
    id: MODELS.Issue,
    lastSequenceId: data.lastSequenceId,
  });
}

export function useIssuesStore() {
  return useStoreManagement({
    store: issuesStore,
    modelName: MODELS.Issue,
    onSaveData: saveIssuesData,
  });
}
