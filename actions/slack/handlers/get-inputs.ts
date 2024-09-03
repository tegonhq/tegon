import { ActionEventPayload, getTeams, Team } from '@tegonhq/sdk';
import axios from 'axios';
import { getSlackHeaders } from 'utils';

export const getInputs = async (payload: ActionEventPayload) => {
  const { workspaceId, integrationAccounts } = payload;

  const integrationAccount = integrationAccounts.slack;
  // Fetch teams from the API
  const teams = await getTeams({ workspaceId });

  // Create a map of teams with label and value properties
  const teamOptions = teams.map((team: Team) => ({
    label: team.name,
    value: team.id,
  }));

  const slackChannels = (
    await axios.get(
      `https://slack.com/api/conversations.list`,
      await getSlackHeaders(integrationAccount),
    )
  ).data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let channelId: any = {
    type: 'text',
    title: 'Channels',
    validation: {
      required: true,
    },
  };
  if (slackChannels.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channelOptions = slackChannels.channels.map((channel: any) => ({
      label: channel.name,
      value: channel.id,
    }));
    channelId = {
      type: 'select',
      title: 'Channels',
      validation: {
        required: true,
      },
      options: channelOptions,
    };
  }

  return {
    type: 'object',
    properties: {
      channelTeamMappings: {
        type: 'array',
        title: 'Channel to Team Mappings',
        description: 'Map each channel to a team',
        items: {
          type: 'object',
          properties: {
            channelId,
            teamId: {
              type: 'select',
              title: 'Teams',
              validation: {
                required: true,
              },
              options: teamOptions,
            },
          },
        },
      },
    },
  };
};
