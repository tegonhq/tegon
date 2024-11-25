import { sort } from 'fast-sort';
import React from 'react';

import type { ConversationHistoryType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

export const useConversationHistory = (conversationId: string) => {
  const { conversationHistoryStore } = useContextStore();

  return React.useMemo(() => {
    const conversationHistory =
      conversationHistoryStore.getConversationHistoryForConversation(
        conversationId,
      );
    return sort(conversationHistory).asc(
      (co: ConversationHistoryType) => new Date(co.createdAt),
    ) as ConversationHistoryType[];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, conversationHistoryStore.conversationHistory.length]);
};
