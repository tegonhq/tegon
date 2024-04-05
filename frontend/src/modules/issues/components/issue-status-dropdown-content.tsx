/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { WORKFLOW_CATEGORY_ICONS } from 'modules/team-settings/workflow/workflow-item';

import type { WorkflowType } from 'common/types/team';

import { Checkbox } from 'components/ui/checkbox';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'components/ui/command';

interface IssueStatusDropdownContentProps {
  workflows: WorkflowType[];
  onChange?: (id: string | string[]) => void;
  onClose: () => void;
  multiple?: boolean;
  value: string | string[];
}

export function IssueStatusDropdownContent({
  workflows,
  onChange,
  onClose,
  multiple = false,
  value,
}: IssueStatusDropdownContentProps) {
  const onValueChange = (checked: boolean, id: string) => {
    if (checked && !value.includes(id)) {
      onChange && onChange([...value, id]);
    }

    if (!checked && value.includes(id)) {
      const newIds = [...value];
      const indexToDelete = newIds.indexOf(id);

      newIds.splice(indexToDelete, 1);
      onChange && onChange(newIds);
    }
  };

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

                if (!multiple) {
                  onClose();
                  onChange && onChange(workflow.id);
                } else {
                  onValueChange(true, workflow.id);
                }
              }}
            >
              <div className="flex gap-2 items-center ">
                {multiple && (
                  <Checkbox
                    id={workflow.name}
                    checked={value.includes(workflow.id)}
                    onCheckedChange={(value: boolean) => {
                      onValueChange(value, workflow.id);
                    }}
                  />
                )}
                <CategoryIcon
                  size={18}
                  className="text-muted-foreground mr-2"
                  color={workflow.color}
                />
                {workflow.name}
              </div>
            </CommandItem>
          );
        })}
      </CommandGroup>
    </Command>
  );
}
