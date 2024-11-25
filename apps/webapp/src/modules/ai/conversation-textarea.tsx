import { Button } from '@tegonhq/ui/components/ui/button';
import { Textarea } from '@tegonhq/ui/components/ui/textarea';
import { SendLine } from '@tegonhq/ui/icons';
import { useState } from 'react';

interface ConversationTextareaProps {
  onSend: (value: string) => void;
}

export function ConversationTextarea({ onSend }: ConversationTextareaProps) {
  const [text, setText] = useState('');

  return (
    <div className="p-3 px-5 relative">
      <Textarea
        className="bg-transparent border border-border max-h-[500px]"
        rows={1}
        value={text}
        autoFocus
        onChange={(e) => setText(e.currentTarget.value)}
        placeholder="Ask AI anything..."
      />
      <Button
        variant="ghost"
        className="transition-all duration-500 ease-in-out my-2 absolute bottom-2 right-6"
        type="submit"
        onClick={() => {
          onSend(text);
          setText('');
        }}
      >
        <SendLine size={20} />
      </Button>
    </div>
  );
}
