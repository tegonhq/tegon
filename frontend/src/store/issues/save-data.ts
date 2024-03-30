/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { IssuesStoreType } from './store';

import type { SyncActionRecord } from 'common/types/data-loader';

import { tegonDatabase } from 'store/database';

export async function saveIssuesData(
  data: SyncActionRecord[],
  issuesStore: IssuesStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
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
        subscriberIds: record.data.subscriberIds,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.issues.put(issue);
          return (
            issuesStore && (await issuesStore.update(issue, record.data.id))
          );
        }

        case 'U': {
          await tegonDatabase.issues.put(issue);
          return (
            issuesStore && (await issuesStore.update(issue, record.data.id))
          );
        }

        case 'D': {
          await tegonDatabase.issues.delete(record.data.id);
          return issuesStore && (await issuesStore.deleteById(record.data.id));
        }
      }
    }),
  );
}
