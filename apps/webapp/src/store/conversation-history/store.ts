import { type IAnyStateTreeNode, types, flow } from 'mobx-state-tree';

import type { ConversationHistoryType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { ConversationHistory } from './models';

export const ConversationHistoryStore: IAnyStateTreeNode = types
  .model({
    conversationHistory: types.array(ConversationHistory),
    workspaceId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (conversation: ConversationHistoryType, id: string) => {
      const indexToUpdate = self.conversationHistory.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.conversationHistory[indexToUpdate] = {
          ...self.conversationHistory[indexToUpdate],
          ...conversation,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.conversationHistory.push(conversation);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.conversationHistory.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToDelete !== -1) {
        self.conversationHistory.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* () {
      const conversationHistory =
        yield tegonDatabase.conversationHistory.toArray();

      self.conversationHistory = conversationHistory;
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getConversationHistoryForConversation(id: string) {
      return self.conversationHistory.filter(
        (ch: ConversationHistoryType) => ch.conversationId === id,
      );
    },
  }));
