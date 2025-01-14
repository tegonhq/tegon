'use client';

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from '@tegonhq/ui/components/command';
import * as React from 'react';

const shortcuts = {
  navigation: [
    { title: 'Command menu', shortcut: '⌘ K' },
    { title: 'Submit issue', shortcut: '⌘ Enter' },
    { title: 'Back', shortcut: 'Esc' },
    { title: 'Search', shortcut: '⌘ /' },
  ],
  common: [
    { title: 'Create issue', shortcut: 'C' },
    { title: 'Open shortcuts guide', shortcut: 'Shift /' },
    { title: 'Copy issue URL from the issue details page', shortcut: '⌘ C' }
]
};

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsDialog({ 
  open, 
  onOpenChange 
}: KeyboardShortcutsDialogProps) {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search for shortcuts" />
      <CommandList>
        <CommandGroup heading="Navigation">
          {shortcuts.navigation.map(({ title, shortcut }) => (
            <CommandItem key={title}>
              <div className="flex w-full justify-between">
                <span>{title}</span>
                <kbd className="bg-muted px-2 rounded">{shortcut}</kbd>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Common">
          {shortcuts.common.map(({ title, shortcut }) => (
            <CommandItem key={title}>
              <div className="flex w-full justify-between">
                <span>{title}</span>
                <kbd className="bg-muted px-2 rounded">{shortcut}</kbd>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}