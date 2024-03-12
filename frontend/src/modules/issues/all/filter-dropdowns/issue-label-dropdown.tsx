/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { IssueLabelDropdownContent } from 'modules/issues/components';

import { cn } from 'common/lib/utils';
import type { LabelType } from 'common/types/label';

import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { useTeamLabels } from 'hooks/labels';

interface IssueLabelDropdownProps {
  value?: string[];
  onChange?: (assigneeIds: string[]) => void;
}

export function IssueLabelDropdown({
  value,
  onChange,
}: IssueLabelDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const labels = useTeamLabels();

  const getLabel = (labelId: string) => {
    return labels.find((label: LabelType) => label.id === labelId);
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
              'flex items-center justify-between !bg-transparent hover:bg-transparent p-0 border-0 text-xs font-normal focus-visible:ring-1 focus-visible:border-primary text-muted-foreground',
              value && 'text-foreground',
            )}
          >
            {value.length > 1 ? (
              <>{value.length} Labels</>
            ) : (
              <>{getLabel(value[0]).name}</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <IssueLabelDropdownContent
            labels={labels}
            onChange={onChange}
            value={value}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
