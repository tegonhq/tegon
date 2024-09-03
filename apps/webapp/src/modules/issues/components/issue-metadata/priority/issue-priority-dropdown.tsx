import { Button } from '@tegonhq/ui/components/button';
import { Command, CommandInput } from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { cn } from '@tegonhq/ui/lib/utils';
import * as React from 'react';

import { Priorities } from 'common/types';

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
          variant="link"
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
          variant="link"
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
        variant="link"
        role="combobox"
        aria-expanded={open}
        className="flex items-center justify-between focus-visible:ring-1 focus-visible:border-primary"
      >
        <PriorityIcon.icon
          size={16}
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
