/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { SyncActionRecord } from 'common/types/data-loader';

import { commentsStore } from 'store/comments';
import { tegonDatabase } from 'store/database';

export async function saveCommentsData(data: SyncActionRecord[]) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const comment = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,

        issueId: record.data.issueId,
        userId: record.data.userId,
        body: record.data.body,
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
          return commentsStore && (await commentsStore.delete(record.data.id));
        }
      }
    }),
  );
}

export function useCommentsStore() {
  return commentsStore;
}
