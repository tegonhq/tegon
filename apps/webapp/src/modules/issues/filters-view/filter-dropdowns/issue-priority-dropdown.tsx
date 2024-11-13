import { Button } from '@tegonhq/ui/components/button';
import { Command, CommandInput } from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { IssuePriorityDropdownContent } from 'modules/issues/components';

import { usePriorities } from 'hooks/priorities';

interface IssuePriorityDropdownProps {
  value?: number[];
  onChange?: (priority: number) => void;
}

export const IssuePriorityDropdown = observer(
  ({ value, onChange }: IssuePriorityDropdownProps) => {
    const [open, setOpen] = React.useState(false);
    const Priorities = usePriorities();

    return (
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="link"
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
                <> {Priorities[value[0]]}</>
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
  },
);
