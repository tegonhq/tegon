import type { TeamType } from 'common/types';

import { Button } from '@tegonhq/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tegonhq/ui/components/dropdown-menu';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
import * as React from 'react';

import { useContextStore } from 'store/global-context-provider';

interface TeamProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function TeamDropdown({ value, onChange }: TeamProps) {
  const { teamsStore } = useContextStore();
  const teams = teamsStore.teams;

  React.useEffect(() => {
    if (!value) {
      onChange(teams[0].identifier);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const team = teams.find((team: TeamType) => team.identifier === value);

  if (!teams || !team) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center text-foreground gap-2 px-0"
        >
          <TeamIcon name={team.name} />
          {team?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        {teams.map((team: TeamType) => (
          <DropdownMenuItem
            key={team.id}
            onSelect={() => onChange(team.identifier)}
          >
            {team.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
