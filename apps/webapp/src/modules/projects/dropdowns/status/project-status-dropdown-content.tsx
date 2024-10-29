import { Checkbox } from '@tegonhq/ui/components/checkbox';
import { CommandGroup } from '@tegonhq/ui/components/command';
import {
  BacklogLine,
  CanceledLine,
  DoneFill,
  InProgressLine,
  TodoLine,
} from '@tegonhq/ui/icons';

import { DropdownItem } from 'modules/issues/components/issue-metadata/dropdown-item';

import { getWorkflowColorWithNumber } from 'common/status-color';

interface ProjectStatusDropdownContentProps {
  onChange?: (id: string | string[]) => void;
  onClose: () => void;
  multiple?: boolean;
  value: string | string[];
}

export const statuses = [
  {
    name: 'Backlog',
    color: '1',
    Icon: BacklogLine,
  },
  { name: 'Planned', color: '2', Icon: TodoLine },
  { name: 'In Progress', color: '4', Icon: InProgressLine },
  { name: 'Done', color: '6', Icon: DoneFill },
  { name: 'Canceled', color: '3', Icon: CanceledLine },
];

export function ProjectStatusDropdownContent({
  onChange,
  onClose,
  multiple = false,
  value,
}: ProjectStatusDropdownContentProps) {
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
      {statuses.map((workflow, index) => {
        const CategoryIcon = workflow.Icon;

        return (
          <DropdownItem
            key={workflow.name}
            id={workflow.name}
            value={workflow.name}
            index={index + 1}
            onSelect={(currentValue: string) => {
              if (!multiple) {
                onChange && onChange(currentValue);
                onClose();
              } else {
                onValueChange(!value.includes(currentValue), workflow.name);
              }
            }}
          >
            <div className="flex gap-2 items-center">
              {multiple && (
                <Checkbox
                  id={workflow.name}
                  checked={value.includes(workflow.name)}
                  onCheckedChange={(value: boolean) => {
                    onValueChange(value, workflow.name);
                  }}
                />
              )}
              <label className="flex grow items-center" htmlFor={workflow.name}>
                <CategoryIcon
                  size={18}
                  className="mr-2"
                  color={getWorkflowColorWithNumber(workflow.color).color}
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
