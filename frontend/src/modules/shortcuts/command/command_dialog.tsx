/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandDialog as CommandDialogC,
} from 'components/ui/command';

export function CommandDialog() {
  const [open, setOpen] = React.useState(false);

  useHotkeys('meta+k', () => setOpen(true), { scopes: ['global'] });

  return (
    <CommandDialogC
      open={open}
      onOpenChange={setOpen}
      commandProps={{ shouldFilter: false }}
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>Profile</CommandItem>
          <CommandItem>Billing</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialogC>
  );
}
