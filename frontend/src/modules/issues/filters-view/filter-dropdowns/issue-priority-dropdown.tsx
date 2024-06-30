/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { IssuePriorityDropdownContent } from 'modules/issues/components';

import { cn } from 'common/lib/utils';
import { Priorities } from 'common/types/issue';

import { Button } from 'components/ui/button';
import { Command, CommandInput } from 'components/ui/command';
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
            variant="ghost"
            role="combobox"
            size="sm"
            aria-expanded={open}
            className={cn(
              'flex items-center justify-between p-0 border-0 focus-visible:ring-1 focus-visible:border-primary',
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
          <Command shouldFilter={false}>
            <CommandInput placeholder="Set priority..." autoFocus />
            <IssuePriorityDropdownContent
              onChange={onChange}
              onClose={() => setOpen(false)}
              Priorities={Priorities}
              multiple
              value={value}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
