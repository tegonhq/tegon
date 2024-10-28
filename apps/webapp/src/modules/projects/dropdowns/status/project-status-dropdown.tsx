// import { WORKFLOW_CATEGORY_ICONS } from 'common/types'

// import type { WorkflowType } from 'common/types'

import { Button } from '@tegonhq/ui/components/button';
import { Command, CommandInput } from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import * as React from 'react';

import { getWorkflowColorWithNumber } from 'common/status-color';

import {
  ProjectStatusDropdownContent,
  statuses,
} from './project-status-dropdown-content';

export enum ProjectDropdownVariant {
  DEFAULT = 'DEFAULT',
  LINK = 'LINK',
}

interface ProjectStatusProps {
  value?: string;
  onChange?: (newStatus: string) => void;
  variant?: ProjectDropdownVariant;
}

export function ProjectStatusDropdown({
  value,
  onChange,
  variant,
}: ProjectStatusProps) {
  const [open, setOpen] = React.useState(false);

  function getTrigger() {
    const status = statuses.find((status) => status.name === value);

    if (variant === ProjectDropdownVariant.LINK) {
      return (
        <Button
          variant="link"
          role="combobox"
          aria-expanded={open}
          className="flex items-center px-0 shadow-none justify-between focus-visible:ring-1 focus-visible:border-primary"
        >
          <status.Icon
            size={18}
            color={getWorkflowColorWithNumber(status.color).color}
            className="mr-2"
          />
          {status.name}
        </Button>
      );
    }

    return (
      <Button
        variant="link"
        role="combobox"
        aria-expanded={open}
        className="flex items-center gap-1 justify-between shadow-none focus-visible:ring-1 focus-visible:border-primary "
      >
        <status.Icon
          size={18}
          color={getWorkflowColorWithNumber(status.color).color}
        />
        {status.name}
      </Button>
    );
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="link"
            role="combobox"
            size="sm"
            aria-expanded={open}
            className="flex items-center p-0 justify-between focus-visible:ring-1 focus-visible:border-primary "
          >
            {getTrigger()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder="Set status..." autoFocus />
            <ProjectStatusDropdownContent
              onChange={onChange}
              onClose={() => setOpen(false)}
              value={value}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
