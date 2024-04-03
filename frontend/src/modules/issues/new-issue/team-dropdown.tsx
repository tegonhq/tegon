/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { getTeamColor } from 'common/color-utils';
import type { TeamType } from 'common/types/team';

import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { TeamLine } from 'icons';

import { tegonDatabase } from 'store/database';

interface TeamProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function TeamDropdown({ value, onChange }: TeamProps) {
  const [teams, setTeams] = React.useState<TeamType[]>([]);

  React.useEffect(() => {
    getTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getTeams() {
    const teams = await tegonDatabase.teams.toArray();
    setTeams(teams);

    if (!value) {
      onChange(teams[0].identifier);
    }
  }

  const team = teams.find((team) => team.identifier === value);

  if (!teams || !team) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center text-foreground"
        >
          <div
            className={`p-[2px] w-5 h-5 ${getTeamColor(team?.name, true)} rounded-sm mr-2`}
          >
            <TeamLine
              size={14}
              className={`shrink-0 text-muted-foreground h-4 w-4 ${getTeamColor(team?.name)}`}
            />
          </div>
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
