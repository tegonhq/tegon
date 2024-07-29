import type { IssueRelationsStoreType } from './store';
import type { SyncActionRecord } from '@tegonhq/types';

import { tegonDatabase } from 'store/database';

export async function saveIssueRelationData(
  data: SyncActionRecord[],
  issueRelationsStore: IssueRelationsStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const issueRelation = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,

        type: record.data.type,
        relatedIssueId: record.data.relatedIssueId,

        issueId: record.data.issueId,
        createdById: record.data.createdById,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.issueRelations.put(issueRelation);
          return (
            issueRelationsStore &&
            (await issueRelationsStore.update(issueRelation, record.data.id))
          );
        }

        case 'U': {
          await tegonDatabase.issueRelations.put(issueRelation);
          return (
            issueRelationsStore &&
            (await issueRelationsStore.update(issueRelation, record.data.id))
          );
        }

        case 'D': {
          await tegonDatabase.issueRelations.delete(record.data.id);
          return (
            issueRelationsStore &&
            (await issueRelationsStore.deleteById(record.data.id))
          );
        }
      }
    }),
  );
}
