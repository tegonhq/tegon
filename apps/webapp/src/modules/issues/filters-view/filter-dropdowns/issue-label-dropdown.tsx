import type { LabelType } from '@tegonhq/types';

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

import { useTeamLabels } from 'hooks/labels';

interface IssueLabelDropdownProps {
  value?: string[];
  onChange?: (assigneeIds: string[]) => void;
  teamIdentifier: string;
}

export function IssueLabelDropdown({
  value,
  onChange,
  teamIdentifier,
}: IssueLabelDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const labels = useTeamLabels(teamIdentifier);
  const [labelSearch, setLabelSearch] = React.useState('');

  const getLabel = (labelId: string) => {
    return labels.find((label: LabelType) => label.id === labelId);
  };

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
              onChange={onChange}
              value={value}
              labelSearch={labelSearch}
              setLabelSearch={setLabelSearch}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
