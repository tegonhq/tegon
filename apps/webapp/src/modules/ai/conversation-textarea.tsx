import { AdjustableTextArea } from '@tegonhq/ui/components/adjustable-textarea';
import { Button } from '@tegonhq/ui/components/button';
import { SendLine } from '@tegonhq/ui/icons';
import { useState } from 'react';

interface ConversationTextareaProps {
  onSend: (value: string) => void;
}

export function ConversationTextarea({ onSend }: ConversationTextareaProps) {
  const [text, setText] = useState('');

  return (
    <div className="p-3 px-5">
      <div className="flex flex-col border border-border rounded pt-2">
        <AdjustableTextArea
          className="bg-transparent max-h-[500px] overflow-auto px-2"
          placeholderClassName="px-2"
          value={text}
          autoFocus
          onChange={(e) => setText(e)}
          placeholder="Ask AI anything..."
        />
        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="transition-all duration-500 ease-in-out"
            type="submit"
            onClick={() => {
              onSend(text);
              setText('');
            }}
          >
            <SendLine size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
