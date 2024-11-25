import { Button } from '@tegonhq/ui/components/button';
import { Command, CommandInput } from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { Cycle } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import * as React from 'react';

import type { CycleType } from 'common/types';

import { useTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { CycleDropdownContent } from './cycle-dropdown-content';

export enum CycleDropdownVariant {
  NO_BACKGROUND = 'NO_BACKGROUND',
  DEFAULT = 'DEFAULT',
  LINK = 'LINK',
}

interface CycleDropdownProps {
  value?: string;
  onChange?: (cycleId: string) => void;
  variant?: CycleDropdownVariant;
  teamIdentifier: string;
}

export function CycleDropdown({
  value,
  onChange,
  variant = CycleDropdownVariant.DEFAULT,
  teamIdentifier,
}: CycleDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const { cyclesStore } = useContextStore();
  const team = useTeam(teamIdentifier);
  const cycles = cyclesStore.getCyclesForTeam(team.id);

  const getCycle = (cycleId: string) => {
    return cycles.find((cycle: CycleType) => cycle.id === cycleId);
  };

  function getTrigger() {
    if (variant === CycleDropdownVariant.NO_BACKGROUND) {
      return (
        <>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'h-5 w-5 flex items-center justify-between !bg-transparent shadow-none p-0 border-0 focus-visible:ring-1 focus-visible:border-primary',
            )}
          >
            {value ? (
              <>{getCycle(value).name}</>
            ) : (
              <div className="flex items-center justify-center">
                <Cycle size={20} className="mr-1 text-muted-foreground" />
              </div>
            )}
          </Button>
        </>
      );
    }

    if (variant === CycleDropdownVariant.LINK) {
      return (
        <Button
          variant="link"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex items-center bg-transparent px-0 shadow-none justify-between focus-visible:ring-1 focus-visible:border-primary',
          )}
        >
          {value ? (
            <>
              <Cycle className="h-5 w-5 text-[9px] mr-2" />
              {getCycle(value).name}
            </>
          ) : (
            <div className="text-muted-foreground flex">
              <Cycle size={20} className="mr-2" />
              No Cycle
            </div>
          )}
        </Button>
      );
    }

    return (
      <Button
        variant="link"
        role="combobox"
        aria-expanded={open}
        className={cn(
          'flex items-center justify-between focus-visible:ring-1 focus-visible:border-primary gap-1 flex-wrap max-w-[200px]',
        )}
      >
        {value ? (
          <div className="flex items-center gap-1 shrink min-w-[0px]">
            <Cycle className="w-5 h-5 text-[9px] shrink-0" />

            <div className="truncate"> {getCycle(value).name}</div>
          </div>
        ) : (
          <>
            <Cycle size={20} className="mr-1" /> No Cycle
          </>
        )}
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
        <PopoverContent className="p-0" align="end">
          <Command>
            <CommandInput placeholder="Set cycle..." autoFocus />
            <CycleDropdownContent
              onClose={() => setOpen(false)}
              cycles={cycles}
              onChange={onChange}
              value={value}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
