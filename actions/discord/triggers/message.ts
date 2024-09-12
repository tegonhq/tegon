import {
  createIssueComment,
  logger,
  updateIssueComment,
  getLinkedComment,
  getLinkedIssueBySource,
  ActionEventPayload,
  JsonObject,
} from '@tegonhq/sdk';
import { Client, TextChannel } from 'discord.js';

export const discordMessage = async (payload: ActionEventPayload) => {
  const {
    eventBody: { d: eventData },
    integrationAccounts,
  } = payload;

  const integrationAccount = integrationAccounts.discord;

  const integrationDefinitionConfig = integrationAccount.integrationDefinition
    .config as JsonObject;

  const {
    guild_id: guildId,
    channel_id: channelId,
    id: messageId,
    author: { username: userDisplayName },
  } = eventData;

  if (userDisplayName && userDisplayName.includes('Tegon')) {
    logger.log('Ignoring message from Tegon bot');
    return { message: 'Ignoring message from Tegon bot' };
  }

  const linkedIssue = await getLinkedIssueBySource({
    sourceId: channelId,
  });

  // If no linked issue is found, log and return undefined
  if (!linkedIssue) {
    logger.debug(`No linked issue found for Discord message Id: ${channelId}`);
    return {
      message: `No linked issue found for Discord message Id: ${channelId}`,
    };
  }

  const client = new Client({ intents: [] }); // Create a new client instance
  await client.login(integrationDefinitionConfig.botToken as string); // Login with the bot token

  const channel = (await client.channels.fetch(channelId)) as TextChannel;
  if (!channel) {
    logger.error(`Channel with ID ${channelId} not found.`);
    return null;
  }
  const message = await channel.messages.fetch(messageId);

  // Extract issue ID and synced comment ID from the linked issue
  const { issueId, sourceData: linkedIssueSource } = linkedIssue;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parentId = (linkedIssueSource as Record<string, any>).syncedCommentId;

  // Prepare source data for the linked comment
  const sourceMetadata = {
    id: integrationAccount.id,
    type: integrationAccount.integrationDefinition.slug,
    channelId,
    userDisplayName,
    threadId: channel.id,
  };

  //   let attachmentUrls: AttachmentResponse[] = [];
  //   if (message.files) {
  //     // Get the files buffer from Slack using the integration account and message files
  //     const filesFormData = await getFilesBuffer(
  //       integrationAccount,
  //       message.files,
  //     );

  //     // Upload the files to GCP and get the attachment URLs
  //     attachmentUrls = await uploadAttachment(
  //       integrationAccount.workspaceId,
  //       filesFormData,
  //     );
  //   }

  const linkedComment = await getLinkedComment({ sourceId: messageId });
  if (linkedComment) {
    // If a linked comment exists, update the existing comment
    logger.debug(`Updating existing comment for thread ID: ${messageId}`);

    return await updateIssueComment({
      body: '',
      bodyMarkdown: message.content,
      issueCommentId: linkedComment.comment.id,
    });
  }

  const linkCommentMetadata = {
    url: `https://discord.com/channels/${guildId}/${channelId}/${messageId}`,
    sourceId: messageId,
    sourceData: sourceMetadata,
  };

  return createIssueComment({
    issueId,
    body: '',
    bodyMarkdown: message.content,
    parentId,
    sourceMetadata,
    linkCommentMetadata,
  });
};
