import type { CommentsStoreType } from './store';

import type { SyncActionRecord } from 'common/types';

import { tegonDatabase } from 'store/database';

export async function saveCommentsData(
  data: SyncActionRecord[],
  commentsStore: CommentsStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const comment = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,

        issueId: record.data.issueId,
        userId: record.data.userId,
        body: record.data.body,
        parentId: record.data.parentId,
        sourceMetadata: JSON.stringify(record.data.sourceMetadata),
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.comments.put(comment);
          return (
            commentsStore &&
            (await commentsStore.update(comment, record.data.id))
          );
        }

        case 'U': {
          await tegonDatabase.comments.put(comment);
          return (
            commentsStore &&
            (await commentsStore.update(comment, record.data.id))
          );
        }

        case 'D': {
          await tegonDatabase.comments.delete(record.data.id);
          return (
            commentsStore && (await commentsStore.deleteById(record.data.id))
          );
        }
      }
    }),
  );
}
