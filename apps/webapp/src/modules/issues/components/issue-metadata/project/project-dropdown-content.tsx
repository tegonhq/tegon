import { Checkbox } from '@tegonhq/ui/components/checkbox';
import { CommandGroup } from '@tegonhq/ui/components/command';
import { Project } from '@tegonhq/ui/icons';

import type { ProjectType } from 'common/types';

import { useScope } from 'hooks';

import { DropdownItem } from '../dropdown-item';

interface ProjectDropdownContentProps {
  onChange?: (assigneeId: string | string[]) => void;
  projects: ProjectType[];
  onClose: () => void;
  multiple?: boolean;
  value: string | string[];
}

export function ProjectDropdownContent({
  onChange,
  projects,
  onClose,
  multiple = false,
  value,
}: ProjectDropdownContentProps) {
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
        id="no-project"
        value="No Project"
        index={0}
        onSelect={() => {
          if (!multiple) {
            onChange && onChange(null);
            onClose();
          } else {
            onValueChange(!value.includes('no-project'), 'no-project');
          }
        }}
      >
        <div className="flex gap-2 items-center">
          {multiple && (
            <Checkbox
              id="no-project"
              checked={value.includes('no-project')}
              onCheckedChange={(value: boolean) =>
                onValueChange(value, 'no-project')
              }
            />
          )}
          <div className="flex grow">
            <Project size={20} className="mr-2" />
            No Project
          </div>
        </div>
      </DropdownItem>
      {projects.map((project: ProjectType, index: number) => {
        return (
          <DropdownItem
            key={project.id}
            id={project.id}
            value={project.name}
            index={index + 1}
            onSelect={(currentValue: string) => {
              if (!multiple) {
                onChange && onChange(currentValue);
                onClose();
              } else {
                onValueChange(!value.includes(currentValue), project.id);
              }
            }}
          >
            <div className="flex gap-2 items-center">
              {multiple && (
                <Checkbox
                  id={project.name}
                  checked={value.includes(project.id)}
                  onCheckedChange={(value: boolean) => {
                    onValueChange(value, project.id);
                  }}
                />
              )}
              <label htmlFor={project.name} className="flex gap-2 grow">
                <Project className="h-5 w-5 text-[9px]" />

                {project.name}
              </label>
            </div>
          </DropdownItem>
        );
      })}
    </CommandGroup>
  );
}
