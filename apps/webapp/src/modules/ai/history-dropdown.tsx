import { Button } from '@tegonhq/ui/components/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { ScrollArea } from '@tegonhq/ui/components/scroll-area';
import { sort } from 'fast-sort';
import { HistoryIcon, MessageSquare } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import React from 'react';

import type { ConversationType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

export const AIHistoryDropdown = observer(() => {
  const [open, setOpen] = React.useState(false);
  const { conversationsStore, commonStore } = useContextStore();

  const conversations = React.useMemo(() => {
    return sort(conversationsStore.conversations).desc(
      (conversation: ConversationType) => new Date(conversation.createdAt),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationsStore.conversations.length]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost">
            <HistoryIcon size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="end">
          <Command>
            <CommandInput placeholder="Search conversation..." autoFocus />
            <ScrollArea className="h-48 overflow-auto">
              <CommandGroup>
                {conversations.map((conversation: ConversationType) => (
                  <CommandItem
                    key={conversation.id}
                    value={conversation.id}
                    onSelect={() => {
                      commonStore.update({
                        currentConversationId: conversation.id,
                      });
                      setOpen(false);
                    }}
                  >
                    <div className="flex shrink min-w-[0px] w-full gap-1 items-center">
                      <MessageSquare size={16} className="shrink-0" />
                      <div className="truncate">{conversation.title}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
});
