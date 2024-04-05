/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { cn } from 'common/lib/utils';
import { Priorities } from 'common/types/issue';

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

export function IssuePriorityDropdown({
  value,
  onChange,
  variant = IssuePriorityDropdownVariant.DEFAULT,
}: IssuePriorityProps) {
  const [open, setOpen] = React.useState(false);
  const PriorityIcon = PriorityIcons[value ?? 0];

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
              value === 1 && 'text-[#F9703E]',
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
          size="sm"
          aria-expanded={open}
          className={cn(
            'flex items-center border dark:bg-transparent border-transparent hover:border-slate-200 dark:border-transparent dark:hover:border-slate-700 px-2 shadow-none justify-between text-sm font-normal focus-visible:ring-1 focus-visible:border-primary',
            value === 0 && 'text-muted-foreground',
          )}
        >
          <PriorityIcon.icon
            size={18}
            className={cn('mr-3 text-muted-foreground')}
          />

          <span>{Priorities[value]}</span>
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
          size={14}
          className={cn(
            'mr-2 text-muted-foreground',
            value === 1 && 'text-[#F9703E]',
          )}
        />

        {Priorities[value]}
      </Button>
    );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{getTrigger()}</PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
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
