/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { WORKFLOW_CATEGORY_ICONS } from 'modules/team-settings/workflow/workflow-item';

import type { WorkflowType } from 'common/types/team';

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'components/ui/command';

interface IssueStatusDropdownContentProps {
  workflows: WorkflowType[];
  onChange?: (id: string) => void;
  onClose: () => void;
}

export function IssueStatusDropdownContent({
  workflows,
  onChange,
  onClose,
}: IssueStatusDropdownContentProps) {
  return (
    <Command>
      <CommandInput placeholder="Set status..." />

      <CommandGroup>
        {workflows.map((workflow) => {
          const CategoryIcon = WORKFLOW_CATEGORY_ICONS[workflow.name];

          return (
            <CommandItem
              key={workflow.name}
              value={workflow.name}
              onSelect={(currentValue) => {
                const workflow = workflows.find(
                  (workflow: WorkflowType) =>
                    workflow.name.toLowerCase() === currentValue,
                );
                onClose();
                onChange && onChange(workflow.id);
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
  );
}
