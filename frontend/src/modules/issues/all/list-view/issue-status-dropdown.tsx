/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { IssueStatusDropdownContent } from 'modules/issues/components';
import { WORKFLOW_CATEGORY_ICONS } from 'modules/team-settings/workflow/workflow-item';

import { Button } from 'components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { useTeamWorkflows } from 'hooks/workflows/use-team-workflows';

interface IssueStatusProps {
  value?: string;
  onChange?: (newStatus: string) => void;
}

export function IssueStatusDropdown({ value, onChange }: IssueStatusProps) {
  const [open, setOpen] = React.useState(false);
  const workflows = useTeamWorkflows();
  const workflow = value
    ? workflows.find((workflow) => workflow.id === value)
    : workflows[0];

  React.useEffect(() => {
    if (!value) {
      onChange(workflows[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const CategoryIcon = workflow
    ? WORKFLOW_CATEGORY_ICONS[workflow.name]
    : WORKFLOW_CATEGORY_ICONS['Backlog'];
  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="xs"
            aria-expanded={open}
            className="flex items-center !bg-transparent hover:bg-transparent shadow-none p-0 border-0 justify-between text-xs font-normal focus-visible:ring-1 focus-visible:border-primary "
          >
            <CategoryIcon
              size={16}
              className="text-muted-foreground"
              color={workflow.color}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <IssueStatusDropdownContent
            onChange={onChange}
            onClose={() => setOpen(false)}
            workflows={workflows}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
