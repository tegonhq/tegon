import { Button } from '@tegonhq/ui/components/button';
import { Calendar } from '@tegonhq/ui/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { CalendarLine } from '@tegonhq/ui/icons';
import { format } from 'date-fns';
import * as React from 'react';

import { ProjectDropdownVariant } from './status';

interface ProjectDatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  text?: string;
  variant?: ProjectDropdownVariant;
}

export function ProjectDatePicker({
  value,
  onChange,
  text = null,
  variant,
}: ProjectDatePickerProps) {
  function getTrigger() {
    if (variant === ProjectDropdownVariant.LINK) {
      return (
        <Button
          variant="link"
          role="combobox"
          className="flex items-center px-0 shadow-none justify-between focus-visible:ring-1 focus-visible:border-primary"
        >
          <CalendarLine className="mr-2" />
          {value ? format(value, 'PPP') : text}
        </Button>
      );
    }

    return (
      <Button variant="link" className="gap-2 py-2">
        <CalendarLine />
        {value ? format(value, 'PPP') : text}
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{getTrigger()}</PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={new Date(value)}
          onSelect={(date: Date) => onChange && onChange(date.toISOString())}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
