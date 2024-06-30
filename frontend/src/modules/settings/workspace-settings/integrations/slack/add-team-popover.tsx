/** Copyright (c) 2024, Tegon, all rights reserved. **/

/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import type { IntegrationAccountType } from 'common/types/integration-account';
import type { TeamType } from 'common/types/team';

import { Button } from 'components/ui/button';
import { Command, CommandGroup, CommandItem } from 'components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { TeamIcon } from 'components/ui/team-icon';
import { useTeams } from 'hooks/teams';

import { useUpdateIntegrationAccountMutation } from 'services/oauth';

export interface Team {
  teamId: string;
  teamName: string;
}

export interface ChannelMapping {
  teams: Team[];
  channelId: string;
  channelName: string;
}

interface AddTeamPopover {
  slackAccount: IntegrationAccountType;
  channelMapping: ChannelMapping;
}

export const AddTeamPopover = observer(
  ({ slackAccount, channelMapping }: AddTeamPopover) => {
    const [open, setOpen] = React.useState(false);
    const teams = useTeams();

    const { mutate: updateIntegrationAccount } =
      useUpdateIntegrationAccountMutation({
        onSuccess: () => {},
      });
    const channelMappings = JSON.parse(slackAccount.settings).Slack
      ?.channelMappings;

    const filterTeams = channelMapping.teams
      ? teams.filter(
          (team: TeamType) =>
            channelMapping.teams.filter((tm: Team) => tm.teamId === team.id)
              .length === 0,
        )
      : teams;

    const onSelect = (teamId: string, channelId: string) => {
      const settings = JSON.parse(slackAccount.settings);
      const team = teams.find((team: TeamType) => team.id === teamId);
      const newTeam = { teamId, teamName: team.name };

      updateIntegrationAccount({
        integrationAccountId: slackAccount.id,
        settings: {
          ...settings,
          Slack: {
            ...settings.Slack,
            channelMappings: channelMappings.map(
              (channelMapping: ChannelMapping) => {
                if (channelId === channelMapping.channelId) {
                  const teams = channelMapping.teams
                    ? [...channelMapping.teams, newTeam]
                    : [newTeam];

                  return { ...channelMapping, teams };
                }

                return channelMapping;
              },
            ),
          },
        },
      });
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            Add Team
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandGroup>
              {filterTeams.map((team: TeamType) => (
                <CommandItem
                  key={team.id}
                  value={team.id}
                  onSelect={(currentValue) => {
                    onSelect(currentValue, channelMapping.channelId);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <TeamIcon name={team.name} />

                  <span className="inline-block"> {team.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
