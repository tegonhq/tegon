import {
  ActionEventPayload,
  getTeams,
  IntegrationAccount,
  Team,
} from '@tegonhq/sdk';
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

  const slackChannels = await getAllSlackChannels(integrationAccount);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let channelId: any = {
    type: 'text',
    title: 'Channels',
    validation: {
      required: true,
    },
  };

  if (slackChannels.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channelOptions = slackChannels.map((channel: any) => ({
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

async function getAllSlackChannels(integrationAccount: IntegrationAccount) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let allChannels: any[] = [];
  let nextCursor = '';
  const baseUrl =
    'https://slack.com/api/conversations.list?types=private_channel,public_channel&limit=200';

  try {
    do {
      const url = nextCursor ? `${baseUrl}&cursor=${nextCursor}` : baseUrl;
      const response = await axios.get(
        url,
        getSlackHeaders(integrationAccount),
      );
      const slackChannels = response.data;

      if (!slackChannels.ok) {
        throw new Error(
          `Error fetching Slack channels: ${slackChannels.error}`,
        );
      }

      // Add the retrieved channels to the list
      allChannels = [...allChannels, ...slackChannels.channels];

      // Get the next cursor if available
      nextCursor = slackChannels.response_metadata?.next_cursor || '';
    } while (nextCursor); // Continue if there's a next page

    return allChannels;
  } catch (error) {
    return [];
  }
}
