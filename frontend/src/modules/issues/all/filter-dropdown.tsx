/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { RiFilter3Line } from '@remixicon/react';
import * as React from 'react';

import { Button } from 'components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

export function FilterDropdown() {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="xs"
          className="border-1 border-dashed text-xs"
        >
          <RiFilter3Line size={16} className="mr-2 text-muted-foreground" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Filter..." />

          <CommandGroup>
            <CommandItem
              key="Status"
              value="Status"
              onSelect={(currentValue) => {}}
            >
              Status
            </CommandItem>
            <CommandItem
              key="Assignee"
              value="Assignee"
              onSelect={(currentValue) => {}}
            >
              Assignee
            </CommandItem>
            <CommandItem
              key="Creator"
              value="Creator"
              onSelect={(currentValue) => {}}
            >
              Creator
            </CommandItem>
            <CommandItem
              key="Priority"
              value="Priority"
              onSelect={(currentValue) => {}}
            >
              Priority
            </CommandItem>
            <CommandItem
              key="Label"
              value="Label"
              onSelect={(currentValue) => {}}
            >
              Label
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
