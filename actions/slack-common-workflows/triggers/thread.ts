import {
  AttachmentResponse,
  createIssueComment,
  debug,
  EventBody,
  IntegrationAccount,
  updateIssueComment,
} from '@tegonhq/sdk';

import { SlackIntegrationSettings } from '../types';
import {
  convertSlackMessageToTiptapJson,
  getExternalSlackUser,
} from '../utils';

export const slackThread = async (
  integrationAccount: IntegrationAccount,
  eventBody: EventBody,
) => {
  const event = eventBody.event;

  // Get the message from the event body based on the subtype
  const message = event.subtype === 'message_changed' ? event.message : event;

  if (message.username && message.username.includes('(via Tegon)')) {
    return undefined;
  }

  // Find the channel mapping in the integration account settings
  const slackSettings =
    integrationAccount.settings as unknown as SlackIntegrationSettings;

  // Find the channel mapping for the given channel ID
  const channelMapping = slackSettings.mappings.find(
    ({ channelId: mappedChannelId }: { channelId: string }) =>
      mappedChannelId === event.channel,
  );

  // If no channel mapping is found, return undefined
  if (!channelMapping) {
    return undefined;
  }

  // Generate thread ID and parent thread ID
  const threadId = `${event.channel}_${message.ts}`;
  const parentThreadId = `${event.channel}_${message.thread_ts}`;

  debug(`Handling Slack thread with ID: ${threadId}`);

  const linkedIssue = await getLinkedIssueBySource({
    sourceId: parentThreadId,
  });

  // If no linked issue is found, log and return undefined
  if (!linkedIssue) {
    debug(`No linked issue found for Slack issue ID: ${parentThreadId}`);
    return undefined;
  }

  // Extract issue ID and synced comment ID from the linked issue
  const { issueId, source: linkedIssueSource } = linkedIssue;
  const parentId = (linkedIssueSource as Record<string, string>)
    .syncedCommentId;

  let displayName;
  if (message.user) {
    // Get the Slack user data if user ID is available
    const userData = await getExternalSlackUser(
      integrationAccount,
      message.user,
    );
    displayName = userData.user.real_name;
  }

  // Prepare source data for the linked comment
  const sourceMetadata = {
    idTs: message.ts,
    parentTs: message.thread_ts,
    channelId: event.channel,
    channelType: event.channel_type,
    type: integrationAccount.integrationDefinition.name,
    id: integrationAccount.id,
    userDisplayName: message.username ? message.username : displayName,
  };

  const attachmentUrls: AttachmentResponse[] = [];

  const tiptapMessage = convertSlackMessageToTiptapJson(
    message.blocks,
    attachmentUrls,
  );

  let linkedComment = await getLinkedComment({ sourceId: threadId });
  if (linkedComment) {
    // If a linked comment exists, update the existing comment
    debug(`Updating existing comment for thread ID: ${threadId}`);

    return await updateIssueComment({
      body: tiptapMessage,
      issueCommentId: linkedComment.comment.id,
    });
  }

  linkedComment = {
    url: threadId,
    sourceId: threadId,
    source: {
      type: integrationAccount.integrationDefinition.name,
      integrationAccountId: integrationAccount.id,
    },
    sourceData: sourceMetadata,
  };

  return createIssueComment({
    issueId,
    body: tiptapMessage,
    parentId,
    sourceMetadata,
    linkCommentMetadata: linkedComment,
  });
};
