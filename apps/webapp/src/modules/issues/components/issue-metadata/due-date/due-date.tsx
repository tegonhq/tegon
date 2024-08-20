import { Button } from '@tegonhq/ui/components/button';
import { Calendar } from '@tegonhq/ui/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { AddLine, CalendarLine } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { format } from 'date-fns';
import React from 'react';

interface DueDateProps {
  dueDate?: Date | string;
  dueDateChange: (date: Date) => void;
}

export function DueDate({
  dueDateChange,
  dueDate: initialDueDate,
}: DueDateProps) {
  const [dueDate, setDueDate] = React.useState<Date>(
    initialDueDate ? new Date(initialDueDate) : undefined,
  );

  const onDateChange = (date: Date) => {
    setDueDate(date);
    dueDateChange(date);
  };

  const disablePastDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getTrigger = () => {
    if (dueDate) {
      return (
        <div className="flex items-center">
          <CalendarLine size={20} className="mr-2" />
          {format(dueDate, 'MMM dd')}
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <AddLine size={16} className="mr-2" />
        Add Due date
      </div>
    );
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="link"
            role="combobox"
            className={cn(
              'flex items-center bg-transparent px-0 shadow-none justify-between focus-visible:ring-1 focus-visible:border-primary',
            )}
          >
            {getTrigger()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dueDate}
            onSelect={onDateChange}
            disabled={disablePastDates}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
