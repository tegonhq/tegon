import React from 'react';

import { useContextStore } from 'store/global-context-provider';

export const useConversationHistory = (conversationId: string) => {
  const { conversationHistoryStore } = useContextStore();

  return React.useMemo(() => {
    return conversationHistoryStore.getConversationHistoryForConversation(
      conversationId,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);
};
