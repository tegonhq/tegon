/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { cn } from 'common/lib/utils';
import { Priorities } from 'common/types/issue';

import { Button } from 'components/ui/button';
import { Command, CommandInput } from 'components/ui/command';
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
  className?: string;
}

export function IssuePriorityDropdown({
  value,
  onChange,
  className,
  variant = IssuePriorityDropdownVariant.DEFAULT,
}: IssuePriorityProps) {
  const [open, setOpen] = React.useState(false);
  const PriorityIcon = PriorityIcons[value ?? 0];

  function getTrigger() {
    if (variant === IssuePriorityDropdownVariant.NO_BACKGROUND) {
      return (
        <Button
          variant="ghost"
          role="combobox"
          size="sm"
          aria-expanded={open}
          className={cn(
            'flex gap-2 items-center px-0 shadow-none justify-between focus-visible:ring-1 focus-visible:border-primary',
            className,
          )}
        >
          <PriorityIcon.icon size={16} />
          {Priorities[value]}
        </Button>
      );
    }

    if (variant === IssuePriorityDropdownVariant.LINK) {
      return (
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex items-center px-0 justify-between focus-visible:ring-1 focus-visible:border-primary',
            value === 0 && 'text-muted-foreground',
          )}
        >
          <PriorityIcon.icon size={20} className={cn('mr-2')} />

          <span>{Priorities[value]}</span>
        </Button>
      );
    }

    return (
      <Button
        variant="secondary"
        role="combobox"
        aria-expanded={open}
        className="flex items-center justify-between text-xs focus-visible:ring-1 focus-visible:border-primary"
      >
        <PriorityIcon.icon
          size={14}
          className={cn('mr-2 text-muted-foreground')}
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
          <Command>
            <CommandInput placeholder="Set priority..." autoFocus />
            <IssuePriorityDropdownContent
              onChange={onChange}
              onClose={() => setOpen(false)}
              Priorities={Priorities}
              value={value}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
