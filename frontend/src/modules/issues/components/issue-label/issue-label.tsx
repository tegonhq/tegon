/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiPriceTagFill } from '@remixicon/react';
import { useTeamLabels } from 'hooks/use-team-labels';
import * as React from 'react';

import { LabelType } from 'common/types/label';

import { Button } from 'components/ui/button';
import { Checkbox } from 'components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

interface IssueLabelProps {
  defaultLabelIds: string[];
}

export function IssueLabel({ defaultLabelIds }: IssueLabelProps) {
  const [open, setOpen] = React.useState(false);
  const labels = useTeamLabels();

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="sm"
            aria-expanded={open}
            className="justify-between text-xs font-normal"
          >
            <RiPriceTagFill size={16} className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search status..." />
            <CommandEmpty>No label found.</CommandEmpty>
            <CommandGroup>
              {labels.map((label: LabelType) => {
                return (
                  <CommandItem
                    key={label.name}
                    className="my-1"
                    value={label.name}
                  >
                    <div className="flex gap-2 items-center ">
                      <Checkbox id="terms" />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {label.name}
                      </label>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
