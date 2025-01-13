import {
  ChatMessageList,
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleAvatar,
} from '@tegonhq/ui/components/chat/index';
import { observer } from 'mobx-react-lite';

import { IssueComment } from '../activity/comments-activity/issue-comment';

export const SupportChat = observer(() => {
  return (
    // Wrap with ChatMessageList
    <div>
      <ChatMessageList>
        <ChatBubble variant="sent">
          <ChatBubbleAvatar fallback="US" />
          <ChatBubbleMessage variant="sent">
            Hello, how has your day been? I hope you are doing well.
          </ChatBubbleMessage>
        </ChatBubble>

        <ChatBubble variant="received">
          <ChatBubbleAvatar fallback="AI" />
          <ChatBubbleMessage variant="received">
            Hi, I am doing well, thank you for asking. How can I help you today?
          </ChatBubbleMessage>
        </ChatBubble>

        <ChatBubble variant="received">
          <ChatBubbleAvatar fallback="AI" />
          <ChatBubbleMessage isLoading />
        </ChatBubble>
      </ChatMessageList>
      <IssueComment />
    </div>
  );
});
