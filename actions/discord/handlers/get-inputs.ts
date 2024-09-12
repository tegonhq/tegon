import {
  ActionEventPayload,
  getTeams,
  JsonObject,
  logger,
  Team,
} from '@tegonhq/sdk';
import { Client } from 'discord.js';

export const getInputs = async (payload: ActionEventPayload) => {
  const { workspaceId, integrationAccounts } = payload;

  const integrationAccount = integrationAccounts.discord;

  const integrationDefinitionConfig = integrationAccount.integrationDefinition
    .config as JsonObject;

  const client = new Client({ intents: [] }); // Create a new client instance
  await client.login(integrationDefinitionConfig.botToken as string); // Login with the bot token

  // Fetch teams from the API
  const teams = await getTeams({ workspaceId });

  // Create a map of teams with label and value properties
  const teamOptions = teams.map((team: Team) => ({
    label: team.name,
    value: team.id,
  }));

  const guild = client.guilds.cache.get(integrationAccount.accountId);
  if (!guild) {
    logger.error(`Guild with ID ${integrationAccount.accountId} not found.`);
    return null;
  }

  const discordChannels = await guild.channels.fetch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let channelId: any = {
    type: 'text',
    title: 'Channels',
    validation: {
      required: true,
    },
  };
  if (discordChannels.size > 0) {
    const channelOptions = discordChannels
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((channel: any) => channel.type === 0)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((channel: any) => ({
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
