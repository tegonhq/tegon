import type { ConversationStoreType } from './models';

import type { SyncActionRecord } from 'common/types';

import { tegonDatabase } from 'store/database';

export async function saveConversationData(
  data: SyncActionRecord[],
  conversationStore: ConversationStoreType,
) {
  await Promise.all(
    data.map(async (record: SyncActionRecord) => {
      const conversation = {
        id: record.data.id,
        createdAt: record.data.createdAt,
        updatedAt: record.data.updatedAt,
        title: record.data.title,
        userId: record.data.userId,
        workspaceId: record.data.workspaceId,
      };

      switch (record.action) {
        case 'I': {
          await tegonDatabase.conversations.put(conversation);
          return (
            conversationStore &&
            (await conversationStore.update(conversation, record.data.id))
          );
        }

        case 'U': {
          await tegonDatabase.conversations.put(conversation);
          return (
            conversationStore &&
            (await conversationStore.update(conversation, record.data.id))
          );
        }

        case 'D': {
          await tegonDatabase.conversations.delete(record.data.id);
          return (
            conversationStore &&
            (await conversationStore.deleteById(record.data.id))
          );
        }
      }
    }),
  );
}
