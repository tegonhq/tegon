/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { IssuePriorityDropdownContent } from 'modules/issues/components';

import { cn } from 'common/lib/utils';
import { Priorities } from 'common/types/issue';

import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

interface IssuePriorityDropdownProps {
  value?: number[];
  onChange?: (priority: number) => void;
}

export function IssuePriorityDropdown({
  value,
  onChange,
}: IssuePriorityDropdownProps) {
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
            className={cn(
              'flex items-center justify-between shadow-none !bg-transparent hover:bg-transparent p-0 border-0 focus-visible:ring-1 focus-visible:border-primary',
              value && 'text-foreground',
            )}
          >
            {value.length > 1 ? (
              <>{value.length} Priority</>
            ) : (
              <>{Priorities[value[0]]}</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <IssuePriorityDropdownContent
            onChange={onChange}
            onClose={() => setOpen(false)}
            Priorities={Priorities}
            multiple
            value={value}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
