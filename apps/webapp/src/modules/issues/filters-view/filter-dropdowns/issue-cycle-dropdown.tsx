import { Button } from '@tegonhq/ui/components/button';
import { Command, CommandInput } from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { Cycle } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { CycleDropdownContent } from 'modules/issues/components';

import type { CycleType } from 'common/types';

import { useCycles } from 'hooks/cycles';

interface IssueCycleDropdownProps {
  value?: string[];
  onChange?: (projectIds: string[]) => void;
}

export const IssueCycleDropdown = observer(
  ({ value, onChange }: IssueCycleDropdownProps) => {
    const [open, setOpen] = React.useState(false);

    const { cycles } = useCycles();

    const getCycle = (cycleId: string) => {
      return cycles.find((cycle: CycleType) => cycle.id === cycleId);
    };

    return (
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              size="sm"
              aria-expanded={open}
              className={cn(
                'flex gap-1 items-center justify-between shadow-none !bg-transparent hover:bg-transparent p-0 border-0 focus-visible:ring-1 focus-visible:border-primary text-muted-foreground',
                value && 'text-foreground',
              )}
            >
              {value.length > 1 ? (
                <>{value.length} Cycles</>
              ) : (
                <div className="flex items-center gap-1 shrink min-w-[0px]">
                  <Cycle className="w-5 h-5 text-[9px] shrink-0" />

                  <div className="truncate"> {getCycle(value[0]).name}</div>
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <Command>
              <CommandInput placeholder="Set cycle..." autoFocus />
              <CycleDropdownContent
                onClose={() => setOpen(false)}
                cycles={cycles}
                onChange={onChange}
                value={value}
                multiple
              />
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
