import { types } from 'mobx-state-tree';

import type { ConversationHistoryType } from 'common/types';

export const ConversationHistory = types.model({
  id: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  message: types.string,
  context: types.union(types.null, types.string),
  thoughts: types.union(types.null, types.string),
  userId: types.union(types.null, types.string),
  userType: types.enumeration(['Agent', 'User', 'System']),
  conversationId: types.string,
});

export interface ConversationHistoryStoreType {
  conversations: ConversationHistoryType;
  getConversationHistoryForConversation: (
    id: string,
  ) => ConversationHistoryType[];
  update: (
    conversation: Partial<ConversationHistoryType>,
    id: string,
  ) => Promise<ConversationHistoryType>;
  deleteById: (id: string) => Promise<void>;
}
