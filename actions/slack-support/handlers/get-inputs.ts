import { getLabels, getTeams, Label } from '@tegonhq/sdk';
import { ActionEventPayload, IntegrationAccount } from '@tegonhq/sdk';
import axios from 'axios';
import { getSlackHeaders } from 'utils';

export const getInputs = async (payload: ActionEventPayload) => {
  const { workspaceId, integrationAccounts } = payload;

  const integrationAccount = integrationAccounts.slack;

  const labels = await getLabels({
    workspaceId,
  });

  const teams = await getTeams({ workspaceId });

  const teamOptions = teams.map((team) => ({
    label: team.name,
    value: team.id,
  }));

  const labelOptions = labels.map((label: Label) => ({
    label: label.name,
    value: label.id,
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
      teamId: {
        type: 'select',
        title: 'Team',
        description: 'Select a support team',
        validation: {
          required: true,
        },
        options: teamOptions,
      },
      channelLabelMappings: {
        type: 'array',
        title: 'Channel to Customer Mappings',
        description: 'Map each channel to a Customer',
        items: {
          type: 'object',
          properties: {
            channelId,
            labelId: {
              type: 'select',
              title: 'Customer',
              validation: {
                required: true,
              },
              options: labelOptions,
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
