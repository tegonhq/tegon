/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { Button } from 'components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

interface IssuePriorityProps {
  value?: number;
  onChange?: (priority: number) => void;
}

const Priorities = ['No priority', 'Urgent', 'High', 'Medium', 'Low'];

export function IssuePriority({ value, onChange }: IssuePriorityProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="xs"
            aria-expanded={open}
            className="flex items-center justify-between text-xs font-normal focus-visible:ring-1 focus-visible:border-primary"
          >
            {Priorities[value]}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Set priority..." />
            <CommandGroup>
              {Priorities.map((priority, index) => {
                return (
                  <CommandItem
                    key={priority}
                    value={`${index}`}
                    onSelect={(currentValue) => {
                      onChange && onChange(parseInt(currentValue, 10));
                      setOpen(false);
                    }}
                  >
                    {priority}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
