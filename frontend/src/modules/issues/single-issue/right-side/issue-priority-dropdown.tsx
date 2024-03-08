/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { IssuePriorityDropdownContent } from 'modules/issues/components';

import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

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
            size="lg"
            aria-expanded={open}
            className="flex items-center border dark:bg-transparent border-transparent hover:border-gray-200 dark:border-transparent dark:hover:border-gray-700 px-3 shadow-none justify-between text-sm font-normal focus-visible:ring-1 focus-visible:border-primary"
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
