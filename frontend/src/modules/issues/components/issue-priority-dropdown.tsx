/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { cn } from 'common/lib/utils';

import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

import {
  IssuePriorityDropdownContent,
  PriorityIcons,
} from './issue-priority-dropdown-content';

export enum IssuePriorityDropdownVariant {
  NO_BACKGROUND = 'NO_BACKGROUND',
  DEFAULT = 'DEFAULT',
  LINK = 'LINK',
}

interface IssuePriorityProps {
  value?: number;
  onChange?: (priority: number) => void;
  variant?: IssuePriorityDropdownVariant;
}

const Priorities = ['No priority', 'Urgent', 'High', 'Medium', 'Low'];

export function IssuePriorityDropdown({
  value,
  onChange,
  variant = IssuePriorityDropdownVariant.DEFAULT,
}: IssuePriorityProps) {
  const [open, setOpen] = React.useState(false);
  const PriorityIcon = PriorityIcons[value];

  function getTrigger() {
    if (variant === IssuePriorityDropdownVariant.NO_BACKGROUND) {
      return (
        <Button
          variant="outline"
          role="combobox"
          size="xs"
          aria-expanded={open}
          className="flex items-center px-0 shadow-none !bg-transparent hover:bg-transparent border-none justify-between text-xs font-normal focus-visible:ring-1 focus-visible:border-primary"
        >
          <PriorityIcon.icon
            size={PriorityIcon.size}
            className={cn(
              'mr-2 text-muted-foreground',
              value === 1 && 'text-orange-600',
            )}
          />
        </Button>
      );
    }

    if (variant === IssuePriorityDropdownVariant.LINK) {
      return (
        <Button
          variant="outline"
          role="combobox"
          size="lg"
          aria-expanded={open}
          className="flex items-center border dark:bg-transparent border-transparent hover:border-gray-200 dark:border-transparent dark:hover:border-gray-700 px-3 shadow-none justify-between text-sm font-normal focus-visible:ring-1 focus-visible:border-primary"
        >
          <PriorityIcon.icon
            size={PriorityIcon.size}
            className={cn(
              'mr-2 text-muted-foreground',
              value === 1 && 'text-orange-600',
            )}
          />

          {Priorities[value]}
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        role="combobox"
        size="xs"
        aria-expanded={open}
        className="flex items-center justify-between text-xs font-normal focus-visible:ring-1 focus-visible:border-primary"
      >
        <PriorityIcon.icon
          size={PriorityIcon.size}
          className={cn(
            'mr-2 text-muted-foreground',
            value === 1 && 'text-orange-600',
          )}
        />

        {Priorities[value]}
      </Button>
    );
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{getTrigger()}</PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <IssuePriorityDropdownContent
            onChange={onChange}
            onClose={() => setOpen(false)}
            Priorities={Priorities}
            value={value}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
