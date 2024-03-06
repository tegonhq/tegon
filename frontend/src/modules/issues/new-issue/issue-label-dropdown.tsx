/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiPriceTagFill } from '@remixicon/react';
import * as React from 'react';

import { cn } from 'common/lib/utils';
import { LabelType } from 'common/types/label';

import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { useTeamLabels } from 'hooks/labels/use-team-labels';

import { IssueLabelDropdownContent } from '../components/issue-label-dropdown-content';

interface IssueLabelProps {
  value: string[];
  onChange?: (value: string[]) => void;
}

export function IssueLabelDropdown({ value = [], onChange }: IssueLabelProps) {
  const [open, setOpen] = React.useState(false);
  const labels = useTeamLabels();

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
              value.length > 0 && 'text-foreground',
              value.length === 0 && 'text-muted-foreground',
            )}
          >
            {labelTitle()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <IssueLabelDropdownContent
            onChange={onChange}
            value={value}
            labels={labels}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
