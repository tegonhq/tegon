import { type IAnyStateTreeNode, types, flow } from 'mobx-state-tree';

import type { ConversationType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { Conversation } from './models';

export const ConversationsStore: IAnyStateTreeNode = types
  .model({
    conversations: types.array(Conversation),
    workspaceId: types.union(types.string, types.undefined),
  })
  .actions((self) => {
    const update = (conversation: ConversationType, id: string) => {
      const indexToUpdate = self.conversations.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToUpdate !== -1) {
        // Update the object at the found index with the new data
        self.conversations[indexToUpdate] = {
          ...self.conversations[indexToUpdate],
          ...conversation,
          // TODO fix the any and have a type with Issuetype
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      } else {
        self.conversations.push(conversation);
      }
    };
    const deleteById = (id: string) => {
      const indexToDelete = self.conversations.findIndex(
        (obj) => obj.id === id,
      );

      if (indexToDelete !== -1) {
        self.conversations.splice(indexToDelete, 1);
      }
    };

    const load = flow(function* () {
      const conversations = yield tegonDatabase.conversations.toArray();

      self.conversations = conversations;
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getConversationWithId(id: string) {
      return self.conversations.find(
        (conversation: ConversationType) => conversation.id === id,
      );
    },
  }));
