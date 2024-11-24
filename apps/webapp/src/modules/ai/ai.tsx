import { UserTypeEnum } from '@tegonhq/types';
import { Button } from '@tegonhq/ui/components/button';
import { Textarea } from '@tegonhq/ui/components/textarea';
import { AddLine, SendLine } from '@tegonhq/ui/icons';
import { AI as AII } from '@tegonhq/ui/icons';
import { HistoryIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { useCreateConversationMutation } from 'services/conversations';

import { AIConversation } from './ai-conversation';

export const AI = observer(() => {
  const { mutate: createConversation } = useCreateConversationMutation({});
  const [text, setText] = useState('');

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center gap-2 p-3 px-5 font-mono">
        <div className="flex gap-2">
          <AII />
          Tegon AI
        </div>

        <div className="flex gap-1 items-center">
          <Button variant="ghost">
            <AddLine size={16} />
          </Button>

          <Button variant="ghost">
            <HistoryIcon size={16} />
          </Button>
        </div>
      </div>
      <div className="grow">
        <AIConversation />
      </div>

      <div className="p-3 px-5 relative">
        <Textarea
          className="bg-transparent border border-border max-h-[500px]"
          rows={4}
          autoFocus
          onChange={(e) => setText(e.currentTarget.value)}
          placeholder="Ask AI anything..."
        />
        <Button
          variant="ghost"
          className="transition-all duration-500 ease-in-out my-2 absolute bottom-2 right-6"
          type="submit"
          onClick={() => {
            createConversation({
              message: text,
              userType: UserTypeEnum.User,
            });
          }}
        >
          <SendLine size={20} />
        </Button>
      </div>
    </div>
  );
});
