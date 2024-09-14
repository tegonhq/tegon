import { Checkbox } from '@tegonhq/ui/components/checkbox';
import { CommandGroup } from '@tegonhq/ui/components/command';

import { getWorkflowColor } from 'common/status-color';
import type { WorkflowType } from 'common/types';
import { getWorkflowIcon } from 'common/workflow-icons';

import { DropdownItem } from '../dropdown-item';

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
    <CommandGroup>
      {workflows.map((workflow, index) => {
        const CategoryIcon = getWorkflowIcon(workflow);

        return (
          <DropdownItem
            key={workflow.name}
            id={workflow.id}
            value={workflow.name}
            index={index + 1}
            onSelect={(currentValue: string) => {
              if (!multiple) {
                onChange && onChange(currentValue);
                onClose();
              }
            }}
          >
            <div className="flex gap-2 items-center">
              {multiple && (
                <Checkbox
                  id={workflow.name}
                  checked={value.includes(workflow.id)}
                  onCheckedChange={(value: boolean) => {
                    onValueChange(value, workflow.id);
                  }}
                />
              )}
              <label className="flex grow items-center" htmlFor={workflow.name}>
                <CategoryIcon
                  size={18}
                  className="mr-2"
                  color={getWorkflowColor(workflow).color}
                />
                {workflow.name}
              </label>
            </div>
          </DropdownItem>
        );
      })}
    </CommandGroup>
  );
}
