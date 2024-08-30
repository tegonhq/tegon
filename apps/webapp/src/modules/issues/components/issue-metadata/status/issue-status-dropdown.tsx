import { Button } from '@tegonhq/ui/components/button';
import { Command, CommandInput } from '@tegonhq/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import * as React from 'react';

import { IssueStatusDropdownContent } from 'modules/issues/components';

import { getWorkflowColor } from 'common/status-color';
import { WORKFLOW_CATEGORY_ICONS } from 'common/workflow-icons';

import { useTeamWorkflows } from 'hooks/workflows/use-team-workflows';

export enum IssueStatusDropdownVariant {
  NO_BACKGROUND = 'NO_BACKGROUND',
  DEFAULT = 'DEFAULT',
  LINK = 'LINK',
}

interface IssueStatusProps {
  value?: string;
  onChange?: (newStatus: string) => void;
  variant?: IssueStatusDropdownVariant;
  teamIdentifier: string;
}

export function IssueStatusDropdown({
  value,
  onChange,
  variant = IssueStatusDropdownVariant.DEFAULT,
  teamIdentifier,
}: IssueStatusProps) {
  const [open, setOpen] = React.useState(false);
  const workflows = useTeamWorkflows(teamIdentifier);

  const workflow = value
    ? workflows.find((workflow) => workflow.id === value)
    : workflows[0];

  if (!workflow) {
    return null;
  }

  const CategoryIcon = workflow
    ? WORKFLOW_CATEGORY_ICONS[workflow.name]
    : WORKFLOW_CATEGORY_ICONS['Backlog'];

  function getTrigger() {
    if (variant === IssueStatusDropdownVariant.NO_BACKGROUND) {
      return (
        <Button
          variant="outline"
          role="combobox"
          size="sm"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="flex items-center !bg-transparent hover:bg-transparent shadow-none p-0 border-0 justify-between focus-visible:ring-1 focus-visible:border-primary "
        >
          <CategoryIcon size={20} color={getWorkflowColor(workflow).color} />
        </Button>
      );
    }

    if (variant === IssueStatusDropdownVariant.LINK) {
      return (
        <Button
          variant="link"
          role="combobox"
          aria-expanded={open}
          className="flex items-center px-0 shadow-none justify-between focus-visible:ring-1 focus-visible:border-primary"
        >
          <CategoryIcon
            size={20}
            className="text-muted-foreground mr-2"
            color={getWorkflowColor(workflow).color}
          />
          {workflow.name}
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
        <CategoryIcon size={18} color={getWorkflowColor(workflow).color} />
        {workflow.name}
      </Button>
    );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{getTrigger()}</PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command>
            <CommandInput placeholder="Set status..." autoFocus />
            <IssueStatusDropdownContent
              onChange={onChange}
              onClose={() => setOpen(false)}
              workflows={workflows}
              value={value}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
