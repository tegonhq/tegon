/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { IssueStatusDropdownContent } from 'modules/issues/components';
// import { WORKFLOW_CATEGORY_ICONS } from 'common/types/status';

// import type { WorkflowType } from 'common/types/team';

import { Button } from 'components/ui/button';
import { Command, CommandInput } from 'components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { useTeamWorkflows } from 'hooks/workflows/use-team-workflows';

interface IssueStatusProps {
  value?: string[];
  onChange?: (newStatus: string[]) => void;
  teamIdentifier: string;
}

export function IssueStatusDropdown({
  value,
  onChange,
  teamIdentifier,
}: IssueStatusProps) {
  const [open, setOpen] = React.useState(false);
  const workflows = useTeamWorkflows(teamIdentifier);

  const getWorkflowData = (workflowId: string) => {
    const workflow = value
      ? workflows.find((workflow) => workflow.id === workflowId)
      : workflows[0];

    return workflow;
  };

  // const getWorkflowIcon = (workflowName: WorkflowType['name']) => {
  //   const WorkflowIcon = WORKFLOW_CATEGORY_ICONS[workflowName];

  //   return <WorkflowIcon />;
  // };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            size="sm"
            aria-expanded={open}
            className="flex items-center p-0 justify-between focus-visible:ring-1 focus-visible:border-primary "
          >
            {value.length > 1
              ? `${value.length} statuses`
              : getWorkflowData(value[0]).name}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder="Set status..." autoFocus />
            <IssueStatusDropdownContent
              onChange={onChange}
              onClose={() => setOpen(false)}
              workflows={workflows}
              value={value}
              multiple
            />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
