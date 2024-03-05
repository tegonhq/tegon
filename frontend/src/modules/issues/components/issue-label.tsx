/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiPriceTagFill } from '@remixicon/react';
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
import { useTeamLabels } from 'hooks/labels/use-team-labels';
import { cn } from 'common/lib/utils';

interface IssueLabelProps {
  value: string[];
  onChange?: (value: string[]) => void;
}

export function IssueLabel({ value = [], onChange }: IssueLabelProps) {
  const [open, setOpen] = React.useState(false);
  const labels = useTeamLabels();

  const onValueChange = (checked: boolean, id: string) => {
    if (checked && !value.includes(id)) {
      onChange && onChange([...value, id]);
    }

    if (!checked && value.includes(id)) {
      const newIds = [...value];
      const indexToDelete = newIds.indexOf(id);

      newIds.splice(indexToDelete, 1);
      onChange && onChange(newIds);
    }
  };

  const labelTitle = () => {
    if (value.length === 1) {
      const label = labels.find((label: LabelType) => label.id === value[0]);
      return (
        <>
          <RiPriceTagFill size={14} className="text-muted-foreground mr-2" />
          {label.name}
        </>
      );
    }

    if (value.length > 1) {
      return (
        <>
          <RiPriceTagFill size={14} className="text-muted-foreground mr-2" />
          {value.length} Labels
        </>
      );
    }

    return (
      <>
        <RiPriceTagFill size={14} className="text-muted-foreground mr-2" />
        Labels
      </>
    );
  };

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
              'flex items-center justify-between text-xs font-normal',
              value.length > 0 && 'text-white',
              value.length === 0 && 'text-muted-foreground',
            )}
          >
            {labelTitle()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Set label..." />
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
                      <Checkbox
                        id={label.name}
                        checked={value.includes(label.id)}
                        onCheckedChange={(value: boolean) =>
                          onValueChange(value, label.id)
                        }
                      />
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
