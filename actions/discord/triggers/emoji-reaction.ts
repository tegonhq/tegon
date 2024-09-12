import {
  ActionEventPayload,
  getLinkedIssueBySource,
  getTeamById,
  getWorkflowsByTeam,
  JsonObject,
  logger,
} from '@tegonhq/sdk';
import { Client, TextChannel } from 'discord.js';
import { getStateId } from 'utils';
import { discordIssueCreate } from './issue-create';

export const emojiReaction = async (payload: ActionEventPayload) => {
  const {
    eventBody: { d: eventData },
    integrationAccounts,
    action,
    userId,
  } = payload;

  const integrationAccount = integrationAccounts.discord;

  const integrationDefinitionConfig = integrationAccount.integrationDefinition
    .config as JsonObject;

  const {
    guild_id: guildId,
    channel_id: channelId,
    user_id: discordUserId,
    message_id: messageId,
    message_author_id: messageAuthorId,
    emoji: { name: reaction },
    member: {
      user: { username: userDisplayName },
    },
  } = eventData;

  const sessionData = {
    guildId,
    channelId,
    discordUserId,
    messageId,
    messageAuthorId,
  };

  const channelMapping = action.data.inputs.channelTeamMappings.find(
    ({ channelId: mappedChannelId }: { channelId: string }) =>
      mappedChannelId === channelId,
  );

  if (!channelMapping) {
    logger.debug(`The channel is not connected`);
    return null;
  }

  // If the reaction is not 'eyes' or the channel mapping doesn't exist, ignore the event
  if (reaction !== '👀') {
    logger.debug(`Ignoring reaction event with reaction: ${reaction}`);
    return { message: `Ignoring reaction event with reaction: ${reaction}` };
  }

  const client = new Client({ intents: [] }); // Create a new client instance
  await client.login(integrationDefinitionConfig.botToken as string); // Login with the bot token

  const channel = (await client.channels.fetch(channelId)) as TextChannel;
  if (!channel) {
    logger.error(`Channel with ID ${channelId} not found.`);
    return null;
  }
  const message = await channel.messages.fetch(messageId);

  const teamId = channelMapping.teamId;
  const sourceId = messageId;

  // Check if the thread is already linked to an existing issue
  const [linkedIssue, workflowStates] = await Promise.all([
    getLinkedIssueBySource({ sourceId }),
    getWorkflowsByTeam({ teamId }),
  ]);

  // // If the thread is already linked to an issue, send an ephemeral message and return
  if (linkedIssue) {
    const team = await getTeamById({ teamId });
    const issueIdentifier = `${team.identifier}-${linkedIssue.issue.number}`;

    const issueUrl = `https://app.tegon.ai/${team.workspace.slug}/issue/${issueIdentifier}`;

    const issueTitle = `${issueIdentifier} ${linkedIssue.issue.title}`;

    await message.reply(
      `This message is already linked with an existing Issue [${issueTitle}](${issueUrl}). so we can't create a new Issue`,
    );

    logger.debug(
      `Thread already linked to an existing issue. Skipping issue creation.`,
    );
    return undefined;
  }

  const stateId = getStateId('opened', workflowStates);

  // Create source metadata object
  const sourceMetadata = {
    id: integrationAccount.id,
    type: integrationAccount.integrationDefinition.slug,
    channelId,
    userDisplayName,
  };

  const linkIssueData = {
    url: `https://discord.com/channels/${guildId}/${channelId}/${messageId}`,
    sourceId,
    sourceData: {
      type: integrationAccount.integrationDefinition.slug,
      channelId,
      messageAuthorId,
      userDisplayName,
      title: `Discord message from ${channel.name}`,
    },
    createdById: userId,
  };

  // Create issue input data
  const issueInput = {
    description: '',
    descriptionMarkdown: message.content,
    stateId,
    isBidirectional: true,
    subscriberIds: [...(userId ? [userId] : [])],
    teamId,
    sourceMetadata,
    linkIssueData,
  };

  return await discordIssueCreate(
    integrationAccount,
    { issueInput, sourceMetadata },
    sessionData,
  );
};
