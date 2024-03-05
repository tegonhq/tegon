/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

import { IssuePriorityDropdownContent } from '../components/issue-priority-dropdown-content';

interface IssuePriorityProps {
  value?: number;
  onChange?: (priority: number) => void;
}

const Priorities = ['No priority', 'Urgent', 'High', 'Medium', 'Low'];

export function IssuePriorityDropdown({ value, onChange }: IssuePriorityProps) {
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
          <IssuePriorityDropdownContent
            onChange={onChange}
            onClose={() => setOpen(false)}
            Priorities={Priorities}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
