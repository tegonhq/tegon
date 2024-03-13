/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { SyncActionRecord } from 'common/types/data-loader';

import { tegonDatabase } from 'store/database';
import { issueHistoryStore } from 'store/issue-history';

export async function saveIssueHistoryData(data: SyncActionRecord[]) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const issueHistory = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        userId: record.data.userId,
        issueId: record.data.issueId,
        addedLabelIds: record.data.addedLabelIds,
        removedLabelIds: record.data.removedLabelIds,
        fromPriority: record.data.fromPriority,
        toPriority: record.data.toPriority,
        fromStateId: record.data.fromStateId,
        toStateId: record.data.toStateId,
        fromEstimate: record.data.fromEstimate,
        toEstimate: record.data.toEstimate,
        fromAssigneeId: record.data.fromAssigneeId,
        toAssigneeId: record.data.toAssigneeId,
        fromParentId: record.data.fromParentId,
        toParentId: record.data.toParentId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.issueHistory.put(issueHistory);
          return (
            issueHistoryStore &&
            (await issueHistoryStore.update(issueHistory, record.data.id))
          );
        }

        case 'U': {
          await tegonDatabase.issueHistory.put(issueHistory);
          return (
            issueHistoryStore &&
            (await issueHistoryStore.update(issueHistory, record.data.id))
          );
        }

        case 'D': {
          await tegonDatabase.issueHistory.delete(record.data.id);
          return (
            issueHistoryStore &&
            (await issueHistoryStore.delete(record.data.id))
          );
        }
      }
    }),
  );
}

export function useIssueHistoryStore() {
  return issueHistoryStore;
}
