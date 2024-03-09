/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiPriceTagFill } from '@remixicon/react';
import * as React from 'react';

import { IssueLabelDropdownContent } from 'modules/issues/components';

import { cn } from 'common/lib/utils';
import type { LabelType } from 'common/types/label';

import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { useTeamLabels } from 'hooks/labels';

interface IssueLabelsProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

export function IssueLabels({ value, onChange }: IssueLabelsProps) {
  const [open, setOpen] = React.useState(false);

  const labels = useTeamLabels();

  const labelTitle = () => {
    if (value.length === 1 && labels.length > 0) {
      const label = labels.find((label: LabelType) => label.id === value[0]);
      return (
        <>
          <RiPriceTagFill size={14} className="text-muted-foreground mr-2" />
          {label.name}
        </>
      );
    }

    if (value.length > 1 && labels.length > 0) {
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size="lg"
          aria-expanded={open}
          className={cn(
            'flex items-center border dark:bg-transparent border-transparent hover:border-gray-200 dark:border-transparent dark:hover:border-gray-700 px-3 shadow-none justify-between text-sm font-normal focus-visible:ring-1 focus-visible:border-primary',
            value && 'text-foreground',
          )}
        >
          {labelTitle()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <IssueLabelDropdownContent
          value={value}
          labels={labels}
          onChange={onChange}
        />
      </PopoverContent>
    </Popover>
  );
}
