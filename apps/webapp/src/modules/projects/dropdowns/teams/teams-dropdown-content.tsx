import { Checkbox } from '@tegonhq/ui/components/checkbox';
import { CommandGroup } from '@tegonhq/ui/components/command';
import { TeamLine } from '@tegonhq/ui/icons';

import { DropdownItem } from 'modules/issues/components/issue-metadata/dropdown-item';

import type { TeamType } from 'common/types';

import { useAllTeams } from 'hooks/teams';

interface TeamsDropdownContentProps {
  onChange?: (id: string | string[]) => void;
  onClose: () => void;
  multiple?: boolean;
  value: string | string[];
}

export function TeamsDropdownContent({
  onChange,
  multiple = false,
  value,
}: TeamsDropdownContentProps) {
  const teams = useAllTeams();

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
      {teams.map((team: TeamType, index: number) => {
        return (
          <DropdownItem
            key={team.name}
            id={team.id}
            value={team.name}
            index={index + 1}
            onSelect={() => {}}
          >
            <div className="flex gap-2 w-full items-center">
              {multiple && (
                <Checkbox
                  id={team.id}
                  checked={value.includes(team.id)}
                  onCheckedChange={(value: boolean) => {
                    onValueChange(value, team.id);
                  }}
                />
              )}
              <label className="flex grow items-center" htmlFor={team.id}>
                <TeamLine size={18} className="mr-2" />
                <span className="grow">{team.name}</span>
              </label>
            </div>
          </DropdownItem>
        );
      })}
    </CommandGroup>
  );
}
