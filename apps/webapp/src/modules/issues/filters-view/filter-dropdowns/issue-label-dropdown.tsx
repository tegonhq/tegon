import { Button } from '@tegonhq/ui/components/button';
import { Command, CommandInput } from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { cn } from '@tegonhq/ui/lib/utils';
import * as React from 'react';

import { IssueLabelDropdownContent } from 'modules/issues/components';

import type { LabelType } from 'common/types';

import { useComputedLabels } from 'hooks/labels';

interface IssueLabelDropdownProps {
  value?: string[];
  onChange?: (assigneeIds: string[]) => void;
}

export function IssueLabelDropdown({
  value,
  onChange,
}: IssueLabelDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const { labels } = useComputedLabels();

  const [labelSearch, setLabelSearch] = React.useState('');

  const getLabel = (labelName: string) => {
    return labels.find((label: LabelType) => label.name === labelName);
  };

  const change = (value: string[]) => {
    const names = value.map((val: string) => {
      const label = labels.find((label) => label.id === val);

      return label.name;
    });
    onChange(names);
  };

  const computedValues = value.map((val: string) => {
    const label = labels.find((label) => label.name === val);

    return label.id;
  });

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
        <PopoverContent className="w-72 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Set label..."
              onValueChange={(value: string) => setLabelSearch(value)}
              autoFocus
            />
            <IssueLabelDropdownContent
              labels={labels}
              onChange={change}
              value={computedValues}
              labelSearch={labelSearch}
              setLabelSearch={setLabelSearch}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
