import { UserTypeEnum } from '@tegonhq/types';
import { Loader } from '@tegonhq/ui/components/loader';
import { ScrollArea } from '@tegonhq/ui/components/ui/scroll-area';
import { observer } from 'mobx-react-lite';
import React from 'react';

import type { ConversationHistoryType } from 'common/types';

import { useConversationHistory } from 'hooks/conversations';
import { useCurrentWorkspace } from 'hooks/workspace';

import {
  useCreateConversationHistoryMutation,
  useCreateConversationMutation,
  useStreamConversationMutation,
} from 'services/conversations';

import { useContextStore } from 'store/global-context-provider';

import { ConversationItem } from './conversation-item';
import { ConversationTextarea } from './conversation-textarea';

export const Conversation = observer(() => {
  const { commonStore } = useContextStore();

  const conversationHistory = useConversationHistory(
    commonStore.currentConversationId,
  );
  const workspace = useCurrentWorkspace();
  const {
    mutate: streamConversation,
    isLoading,

    thoughts,
  } = useStreamConversationMutation();
  const { mutate: createConversationHistory } =
    useCreateConversationHistoryMutation({});
  const { mutate: createConversation } = useCreateConversationMutation({});

  const onSend = (text: string) => {
    if (commonStore.currentConversationId) {
      createConversationHistory(
        {
          message: text,
          userType: UserTypeEnum.User,
          conversationId: commonStore.currentConversationId,
        },
        {
          onSuccess: (data) => {
            streamConversation({
              conversationId: commonStore.currentConversationId,
              conversationHistoryId: data.id,
              workspaceId: workspace.id,
            });
          },
        },
      );
    } else {
      createConversation(
        {
          message: text,
          userType: UserTypeEnum.User,
        },
        {
          onSuccess: (data) => {
            commonStore.update({ currentConversationId: data.id });
            streamConversation({
              conversationId: data.id,
              conversationHistoryId: data.ConversationHistory[0].id,
              workspaceId: workspace.id,
            });
          },
        },
      );
    }
  };

  const lastThought = thoughts[thoughts.length - 1];

  return (
    <div className="flex flex-col h-full justify-end overflow-hidden">
      <ScrollArea>
        {conversationHistory.map(
          (conversationHistory: ConversationHistoryType, index: number) => (
            <ConversationItem
              key={index}
              conversationHistory={conversationHistory}
            />
          ),
        )}
        {isLoading && lastThought && (
          <div className="bg-grayAlpha-100 flex flex-wrap p-3 gap-1">
            <Loader text={lastThought.message} variant="horizontal" />
          </div>
        )}
      </ScrollArea>
      <ConversationTextarea onSend={onSend} />
    </div>
  );
});
