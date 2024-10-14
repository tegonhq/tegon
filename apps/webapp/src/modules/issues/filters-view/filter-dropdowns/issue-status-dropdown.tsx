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

import { IssueStatusDropdownContent } from 'modules/issues/components';

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
    const workflow = workflowId
      ? workflows.find((workflow) => workflow.id === workflowId)
      : workflows[0];

    return workflow;
  };

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
