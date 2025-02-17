import React, { useState } from 'react';
import { Button } from '@tegonhq/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tegonhq/ui/components/dropdown-menu';
import { SlackIcon, DocumentLine, HelpLine } from '@tegonhq/ui/icons';
import { KeyboardShortcutsDialog } from './keyboard-shortcuts-layout';

export function BottomBar() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  return (
    <div className="w-full flex justify-between px-6 py-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" className="px-3">
            <HelpLine size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem
            onClick={() => window.open('https://docs.tegon.ai', '_blank')}
          >
            <DocumentLine className="mr-2" size={16} />
            Documentation
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShortcutsOpen(true)}>
            Keyboard Shortcuts
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              window.open(
                'https://join.slack.com/t/tegoncommunity/shared_invite/zt-2jvar8p1x-9wqFTL9PP5ICImb76qcjEA',
                '_blank',
              )
            }
          >
            <SlackIcon className="mr-2" size={16} />
            Slack Community
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <KeyboardShortcutsDialog
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
    </div>
  );
}
