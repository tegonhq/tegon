/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiDeleteBin7Line } from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import React from 'react';

import type { TeamType } from 'common/types/team';

import { Button } from 'components/ui/button';
import { Command, CommandGroup, CommandItem } from 'components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { TeamIcon } from 'components/ui/team-icon';
import { useTeams } from 'hooks/teams';

import { useUpdateIntegrationAccountMutation } from 'services/oauth';

import { useContextStore } from 'store/global-context-provider';

interface Team {
  teamId: string;
  teamName: string;
}

interface ChannelMapping {
  teams: Team[];
  channelId: string;
  channelName: string;
}

interface SlackChannelSettingsProps {
  integrationAccountId: string;
}

function TeamList({
  teams,
  channelId,
  onDelete,
}: {
  teams: Team[];
  channelId: string;
  onDelete: (index: number, channelId: string) => void;
}) {
  const { teamsStore } = useContextStore();

  if (teams.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 w-full mt-4">
      {teams.map((tm: Team, index: number) => {
        const team = teamsStore.getTeamWithId(tm.teamId);

        return (
          <div
            className="flex gap-2 items-center justify-between group min-h-[25px]"
            key={tm.teamId}
          >
            <div className="flex gap-2 items-center">
              <TeamIcon name={team.name} />
              <span className="inline-block"> {team.name}</span>{' '}
            </div>

            <div>
              <Button
                variant="ghost"
                size="xs"
                className="hidden group-hover:block"
                onClick={() => onDelete(index, channelId)}
              >
                <RiDeleteBin7Line size={14} />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const SlackChannelSettings = observer(
  ({ integrationAccountId }: SlackChannelSettingsProps) => {
    const [open, setOpen] = React.useState(false);
    const { integrationAccountsStore } = useContextStore();
    const teams = useTeams();
    const { mutate: updateIntegrationAccount } =
      useUpdateIntegrationAccountMutation({
        onSuccess: () => {},
      });
    const slackAccount =
      integrationAccountsStore.getAccountWithId(integrationAccountId);

    const channelMappings = JSON.parse(slackAccount.settings).Slack
      ?.channelMappings;

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

    const onDelete = (index: number, channelId: string) => {
      const settings = JSON.parse(slackAccount.settings);

      updateIntegrationAccount({
        integrationAccountId: slackAccount.id,
        settings: {
          ...settings,
          Slack: {
            ...settings.Slack,
            channelMappings: channelMappings.map(
              (channelMapping: ChannelMapping) => {
                if (channelId === channelMapping.channelId) {
                  const newTeams = [...channelMapping.teams];
                  newTeams.splice(index, 1);

                  return { ...channelMapping, teams: newTeams };
                }

                return channelMapping;
              },
            ),
          },
        },
      });
    };

    return (
      <div className="flex flex-col w-full">
        {channelMappings.map((channelMapping: ChannelMapping) => {
          const mappedTeams = channelMapping.teams ? channelMapping.teams : [];
          const filterTeams = channelMapping.teams
            ? teams.filter(
                (team: TeamType) =>
                  channelMapping.teams.filter(
                    (tm: Team) => tm.teamId === team.id,
                  ).length === 0,
              )
            : teams;

          return (
            <div
              key={channelMapping.channelId}
              className="border p-3 rounded-md flex flex-col items-center"
            >
              <div className="flex justify-between w-full items-center">
                <h4 className="font-medium"># {channelMapping.channelName} </h4>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="xs">
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
              </div>

              <TeamList
                teams={mappedTeams}
                onDelete={onDelete}
                channelId={channelMapping.channelId}
              />
            </div>
          );
        })}
      </div>
    );
  },
);
