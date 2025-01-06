import { Checkbox } from '@tegonhq/ui/components/checkbox';
import { CommandGroup } from '@tegonhq/ui/components/command';
import { LabelLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';

import type { ProjectMilestoneType } from 'common/types';

import { useScope } from 'hooks';

import { DropdownItem } from '../dropdown-item';

interface ProjectDropdownContentProps {
  onChange?: (assigneeId: string | string[]) => void;
  projectMilestones: ProjectMilestoneType[];
  onClose: () => void;
  multiple?: boolean;
  value: string | string[];
}

export const ProjectMilestoneDropdownContent = observer(
  ({
    onChange,
    projectMilestones,
    onClose,
    multiple = false,
    value,
  }: ProjectDropdownContentProps) => {
    useScope('command');

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
        <DropdownItem
          id="no-project-milestone"
          value="No Project"
          index={0}
          onSelect={() => {
            if (!multiple) {
              onChange && onChange(null);
              onClose();
            } else {
              onValueChange(
                !value.includes('no-project-milestone'),
                'no-project-milestone',
              );
            }
          }}
        >
          <div className="flex gap-2 items-center">
            {multiple && (
              <Checkbox
                id="no-project-milestone"
                checked={value.includes('no-project-milestone')}
                onCheckedChange={(value: boolean) =>
                  onValueChange(value, 'no-project-milestone')
                }
              />
            )}
            <div className="flex grow">
              <LabelLine size={20} className="mr-2" />
              No Project Milestone
            </div>
          </div>
        </DropdownItem>
        {projectMilestones.map(
          (projectMilestone: ProjectMilestoneType, index: number) => {
            return (
              <DropdownItem
                key={projectMilestone.id}
                id={projectMilestone.id}
                value={projectMilestone.name}
                index={index + 1}
                onSelect={(currentValue: string) => {
                  if (!multiple) {
                    onChange && onChange(currentValue);
                    onClose();
                  } else {
                    onValueChange(
                      !value.includes(currentValue),
                      projectMilestone.id,
                    );
                  }
                }}
              >
                <div className="flex gap-2 items-center">
                  {multiple && (
                    <Checkbox
                      id={projectMilestone.name}
                      checked={value.includes(projectMilestone.id)}
                      onCheckedChange={(value: boolean) => {
                        onValueChange(value, projectMilestone.id);
                      }}
                    />
                  )}
                  <label
                    htmlFor={projectMilestone.name}
                    className="flex gap-2 grow"
                  >
                    <LabelLine className="h-5 w-5 text-[9px]" />

                    {projectMilestone.name}
                  </label>
                </div>
              </DropdownItem>
            );
          },
        )}
      </CommandGroup>
    );
  },
);
