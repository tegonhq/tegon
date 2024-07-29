import type { LabelType } from '@tegonhq/types';

import { RiAddLine } from '@remixicon/react';
import { Badge, BadgeColor } from '@tegonhq/ui/components/badge';
import { Button } from '@tegonhq/ui/components/button';
import { Command, CommandInput } from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { LabelLine } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useTeamLabels } from 'hooks/labels/use-team-labels';

import { useContextStore } from 'store/global-context-provider';

import { IssueLabelDropdownContent } from './issue-label-dropdown-content';

export enum IssueLabelDropdownVariant {
  DEFAULT = 'DEFAULT',
  LINK = 'LINK',
}

interface IssueLabelProps {
  value: string[];
  onChange?: (value: string[]) => void;
  variant?: IssueLabelDropdownVariant;
  teamIdentifier: string;
}

export const IssueLabelDropdown = observer(
  ({
    value = [],
    onChange,
    teamIdentifier,
    variant = IssueLabelDropdownVariant.DEFAULT,
  }: IssueLabelProps) => {
    const [open, setOpen] = React.useState(false);
    const [labelSearch, setLabelSearch] = React.useState('');

    const labels = useTeamLabels(teamIdentifier);
    const { labelsStore } = useContextStore();

    function getTrigger() {
      if (variant === IssueLabelDropdownVariant.LINK) {
        return (
          <div className="flex flex-wrap gap-1">
            {labelsStore.getLabelsWithIds(value).map((label: LabelType) => (
              <Badge
                variant="secondary"
                key={label.name}
                className="text-foreground flex items-center"
              >
                <BadgeColor style={{ backgroundColor: label.color }} />
                {label?.name}
              </Badge>
            ))}

            {value.length > 0 ? (
              <Button
                variant="ghost"
                role="combobox"
                size="sm"
                aria-expanded={open}
                className={cn(
                  'flex items-center justify-between font-normal border-0 shadow-none',
                )}
              >
                <div className="flex items-center">
                  <RiAddLine size={14} className="mr-1" />
                </div>
              </Button>
            ) : (
              <Button
                variant="ghost"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  'flex items-center px-1 -ml-2 shadow-none justify-between text-sm font-normal focus-visible:ring-1 focus-visible:border-primary',
                )}
              >
                {labelTitle()}
              </Button>
            )}
          </div>
        );
      }

      return (
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex items-center justify-between font-normal',
            value.length > 0 && 'text-foreground',
            value.length === 0 && 'text-muted-foreground',
          )}
        >
          {labelTitle()}
        </Button>
      );
    }

    const labelTitle = () => {
      if (value.length === 1) {
        const label = labels.find((label: LabelType) => label.id === value[0]);
        return (
          <>
            <LabelLine size={14} className="text-muted-foreground mr-2" />
            {label?.name}
          </>
        );
      }

      if (value.length > 1) {
        return (
          <>
            <LabelLine size={14} className="text-muted-foreground mr-2" />
            {value.length} Labels
          </>
        );
      }

      return (
        <div className="flex items-center">
          <RiAddLine size={16} />
          Add Label
        </div>
      );
    };

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{getTrigger()}</PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="end">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Set label..."
                onValueChange={(value: string) => setLabelSearch(value)}
                autoFocus
              />
              <IssueLabelDropdownContent
                onChange={onChange}
                value={value}
                setLabelSearch={setLabelSearch}
                labelSearch={labelSearch}
                labels={labels}
              />
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
