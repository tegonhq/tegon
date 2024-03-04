/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { WORKFLOW_CATEGORY_ICONS } from 'modules/settings/team/workflow/workflow-item';

import { useTeamWorkflows } from 'hooks/use-team-workflows';

import { Button } from 'components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';

interface IssueStatusProps {
  defaultStateId?: string;
}

export function IssueStatus({ defaultStateId }: IssueStatusProps) {
  const [open, setOpen] = React.useState(false);
  const workflows = useTeamWorkflows();
  const workflow = defaultStateId
    ? workflows.find((workflow) => workflow.id === defaultStateId)
    : workflows[0];

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
            size="sm"
            aria-expanded={open}
            className="justify-between text-xs font-normal focus-visible:ring-1 focus-visible:border-primary"
          >
            <CategoryIcon
              size={18}
              className="text-muted-foreground mr-2"
              color={workflow.color}
            />
            {workflow.name}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search status..." />
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {workflows.map((workflow) => {
                const CategoryIcon = WORKFLOW_CATEGORY_ICONS[workflow.name];

                return (
                  <CommandItem
                    key={workflow.name}
                    value={workflow.name}
                    onSelect={(currentValue) => {
                      setOpen(false);
                    }}
                  >
                    <CategoryIcon
                      size={18}
                      className="text-muted-foreground mr-2"
                      color={workflow.color}
                    />
                    {workflow.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
