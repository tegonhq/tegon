/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiAddLine, RiPriceTagFill } from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { cn } from 'common/lib/utils';
import type { LabelType } from 'common/types/label';

import { Badge, BadgeColor } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { useTeamLabels } from 'hooks/labels/use-team-labels';

import { useContextStore } from 'store/global-context-provider';

import { IssueLabelDropdownContent } from '../components/issue-label-dropdown-content';

export enum IssueLabelDropdownVariant {
  DEFAULT = 'DEFAULT',
  LINK = 'LINK',
}

interface IssueLabelProps {
  value: string[];
  onChange?: (value: string[]) => void;
  variant?: IssueLabelDropdownVariant;
}

export const IssueLabelDropdown = observer(
  ({
    value = [],
    onChange,
    variant = IssueLabelDropdownVariant.DEFAULT,
  }: IssueLabelProps) => {
    const [open, setOpen] = React.useState(false);
    const labels = useTeamLabels();
    const { labelsStore } = useContextStore();

    function getTrigger() {
      if (variant === IssueLabelDropdownVariant.LINK) {
        return (
          <div className="flex flex-wrap gap-2">
            {labelsStore
              .getLabelsWithIds(value)
              .slice(0, 3)
              .map((label: LabelType) => (
                <Badge
                  variant="outline"
                  key={label.name}
                  className="text-muted-foreground flex items-center"
                >
                  <BadgeColor
                    style={{ backgroundColor: label.color }}
                    className="mr-2"
                  />
                  {label.name}
                </Badge>
              ))}

            {value.length > 0 ? (
              <Button
                variant="ghost"
                role="combobox"
                size="xs"
                aria-expanded={open}
                className={cn(
                  'flex items-center justify-between text-xs font-normal border-0 shadow-none',
                  value.length > 0 && 'text-foreground',
                  value.length === 0 && 'text-muted-foreground',
                )}
              >
                <div className="flex items-center text-muted-foreground">
                  <RiAddLine size={18} className="mr-1" />
                  Add Label
                </div>
              </Button>
            ) : (
              <Button
                variant="outline"
                role="combobox"
                size="sm"
                aria-expanded={open}
                className={cn(
                  'flex items-center border px-1 -ml-2 dark:bg-transparent border-transparent hover:border-slate-200 dark:border-transparent dark:hover:border-slate-700 shadow-none justify-between text-sm font-normal focus-visible:ring-1 focus-visible:border-primary',
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
      );
    }

    const labelTitle = () => {
      if (value.length === 1) {
        const label = labels.find((label: LabelType) => label.id === value[0]);
        return (
          <>
            <RiPriceTagFill size={18} className="text-muted-foreground mr-3" />
            {label.name}
          </>
        );
      }

      if (value.length > 1) {
        return (
          <>
            <RiPriceTagFill size={18} className="text-muted-foreground mr-3" />
            {value.length} Labels
          </>
        );
      }

      return (
        <div className="flex items-center text-muted-foreground">
          <RiAddLine size={18} className="mr-1" />
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
  },
);
