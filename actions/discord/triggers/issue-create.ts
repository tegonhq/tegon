import {
  createIssue,
  getTeamById,
  IntegrationAccount,
  JsonObject,
  logger,
} from '@tegonhq/sdk';
import { Client, TextChannel } from 'discord.js';

export const discordIssueCreate = async (
  integrationAccount: IntegrationAccount,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  issueData: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sessionData: Record<string, any>,
) => {
  // Extract issueInput, sourceMetadata, and userId from issueData
  const { issueInput, sourceMetadata } = issueData;

  const integrationDefinitionConfig = integrationAccount.integrationDefinition
    .config as JsonObject;

  logger.info('Creating issue with issueInput', { issueInput });

  const createdIssue = await createIssue(issueInput);

  const team = await getTeamById({ teamId: createdIssue.teamId });

  logger.info('Issue created successfully', { id: createdIssue.id });

  const client = new Client({ intents: [] }); // Create a new client instance
  await client.login(integrationDefinitionConfig.botToken as string); // Login with the bot token

  const channel = (await client.channels.fetch(
    sessionData.channelId,
  )) as TextChannel;
  if (!channel) {
    logger.error(`Channel with ID ${sessionData.channelId} not found.`);
    return null;
  }
  const message = await channel.messages.fetch(sessionData.messageId);

  message.startThread('');
  // Prepare the payload for sending a Slack message
  const messagePayload = {
    channel: sessionData.channelId,
    text: `<@${sessionData.messagedById}> created a Issue`,
    attachments: await getIssueMessageModal(createdIssue, team.workspace.slug),
    ...(sessionData.parentTs ? { thread_ts: sessionData.parentTs } : {}),
  };

  logger.info('Sending Slack message with payload', { messagePayload });

  // Send the Slack message
  const messageResponse = await sendSlackMessage(
    integrationAccount,
    messagePayload,
  );

  if (messageResponse.ok) {
    logger.info('Slack message sent successfully', { messageResponse });

    // Create a comment thread for this Slack thread and Update link issue with synced comment
    await createLinkIssueComment(
      messageResponse,
      integrationAccount,
      issueInput.linkIssueData,
      sessionData.channelId as string,
      createdIssue.id,
      sourceMetadata,
    );
  }

  return createdIssue;
};
