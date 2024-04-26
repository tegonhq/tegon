/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { IssueStatusDropdownContent } from 'modules/issues/components';
import { WORKFLOW_CATEGORY_ICONS } from 'modules/team-settings/workflow/workflow-item';

import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
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
  teamIdentfier: string;
}

export function IssueStatusDropdown({
  value,
  onChange,
  variant = IssueStatusDropdownVariant.DEFAULT,
  teamIdentfier,
}: IssueStatusProps) {
  const [open, setOpen] = React.useState(false);
  const workflows = useTeamWorkflows(teamIdentfier);

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
          size="xs"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="flex items-center !bg-transparent hover:bg-transparent shadow-none p-0 border-0 justify-between text-xs font-normal focus-visible:ring-1 focus-visible:border-primary "
        >
          <CategoryIcon
            size={16}
            className="text-muted-foreground"
            color={workflow.color}
          />
        </Button>
      );
    }

    if (variant === IssueStatusDropdownVariant.LINK) {
      return (
        <Button
          variant="outline"
          role="combobox"
          size="sm"
          aria-expanded={open}
          className="flex items-center border border-transparent hover:bg-slate-100 hover:border-slate-200 dark:border-transparent dark:hover:border-slate-700 px-2 dark:bg-transparent shadow-none justify-between text-sm font-normal focus-visible:ring-1 focus-visible:border-primary"
        >
          <CategoryIcon
            size={18}
            className="text-muted-foreground mr-2"
            color={workflow.color}
          />
          {workflow.name}
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        role="combobox"
        size="xs"
        aria-expanded={open}
        className="flex items-center justify-between shadow-none text-xs font-normal focus-visible:ring-1 focus-visible:border-primary "
      >
        <CategoryIcon
          size={14}
          className="text-muted-foreground mr-2"
          color={workflow.color}
        />
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
          <IssueStatusDropdownContent
            onChange={onChange}
            onClose={() => setOpen(false)}
            workflows={workflows}
            value={value}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
