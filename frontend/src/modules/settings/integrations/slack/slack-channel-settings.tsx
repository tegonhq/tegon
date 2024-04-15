/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiDeleteBin7Line } from '@remixicon/react';
import { observer } from 'mobx-react-lite';
import React from 'react';

import type { IntegrationAccountType } from 'common/types/integration-account';

import { Button } from 'components/ui/button';
import { TeamIcon } from 'components/ui/team-icon';

import { useUpdateIntegrationAccountMutation } from 'services/oauth';

import { useContextStore } from 'store/global-context-provider';

import {
  AddTeamPopover,
  type ChannelMapping,
  type Team,
} from './add-team-popover';

interface SlackChannelSettingsProps {
  slackAccount: IntegrationAccountType;
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
  ({ slackAccount }: SlackChannelSettingsProps) => {
    const { mutate: updateIntegrationAccount } =
      useUpdateIntegrationAccountMutation({
        onSuccess: () => {},
      });

    const channelMappings = JSON.parse(slackAccount.settings).Slack
      ?.channelMappings;

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
      <div className="flex flex-col w-full gap-4">
        {channelMappings.map((channelMapping: ChannelMapping) => {
          const mappedTeams = channelMapping.teams ? channelMapping.teams : [];

          return (
            <div
              key={channelMapping.channelId}
              className="border p-3 rounded-md flex flex-col items-center"
            >
              <div className="flex justify-between w-full items-center">
                <h4 className="font-medium"># {channelMapping.channelName} </h4>

                <AddTeamPopover
                  channelMapping={channelMapping}
                  slackAccount={slackAccount}
                />
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
