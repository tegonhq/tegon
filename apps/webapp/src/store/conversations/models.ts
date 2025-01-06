import { types } from 'mobx-state-tree';

import type { ConversationType } from 'common/types';

export const Conversation = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  title: types.union(types.null, types.string),
  userId: types.string,
  workspaceId: types.string,
});

export interface ConversationStoreType {
  conversations: ConversationType;
  getConversationWithId: (id: string) => ConversationType;
  update: (
    conversation: Partial<ConversationType>,
    id: string,
  ) => Promise<ConversationType>;
  deleteById: (id: string) => Promise<void>;
}
