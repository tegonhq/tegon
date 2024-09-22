import {
  AttachmentResponse,
  createIssueComment,
  logger,
  EventBody,
  IntegrationAccount,
  updateIssueComment,
  getLinkedComment,
  getLinkedIssueBySource,
  uploadAttachment,
  JsonObject,
} from '@tegonhq/sdk';

import {
  convertSlackMessageToTiptapJson,
  getExternalSlackUser,
  getFilesBuffer,
} from '../utils';

export const slackThread = async (
  integrationAccount: IntegrationAccount,
  eventBody: EventBody,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any,
) => {
  const event = eventBody.event;

  // Get the message from the event body based on the subtype
  const message = event.subtype === 'message_changed' ? event.message : event;

  if (message.username && message.username.includes('(via Tegon)')) {
    return undefined;
  }

  // Find the channel mapping for the given channel ID
  const channelMapping = action.data.inputs.channelTeamMappings.find(
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

  logger.debug(`Handling Slack thread with ID: ${threadId}`);

  const linkedIssues = await getLinkedIssueBySource({
    sourceId: parentThreadId,
  });

  // If no linked issue is found, log and return undefined
  if (linkedIssues.length < 1) {
    logger.debug(`No linked issue found for Slack issue ID: ${parentThreadId}`);
    return undefined;
  }
  const linkedIssue = linkedIssues[0];

  const sourceData = linkedIssue.sourceData as JsonObject;
  const syncingLinkedIssue =
    sourceData.type === integrationAccount.integrationDefinition.slug &&
    linkedIssue.sync === true;

  if (!syncingLinkedIssue) {
    return { message: 'Linked issue is not sync with source' };
  }

  // Extract issue ID and synced comment ID from the linked issue
  const { issueId, sourceData: linkedIssueSource } = linkedIssue;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parentId = (linkedIssueSource as Record<string, any>).syncedCommentId;

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
    type: integrationAccount.integrationDefinition.slug,
    id: integrationAccount.id,
    userDisplayName: message.username ? message.username : displayName,
  };

  let attachmentUrls: AttachmentResponse[] = [];
  if (message.files) {
    // Get the files buffer from Slack using the integration account and message files
    const filesFormData = await getFilesBuffer(
      integrationAccount,
      message.files,
    );

    // Upload the files to GCP and get the attachment URLs
    attachmentUrls = await uploadAttachment(
      integrationAccount.workspaceId,
      filesFormData,
    );
  }

  const tiptapMessage = convertSlackMessageToTiptapJson(
    message.blocks,
    attachmentUrls,
  );

  const linkedComment = await getLinkedComment({ sourceId: threadId });
  if (linkedComment) {
    // If a linked comment exists, update the existing comment
    logger.debug(`Updating existing comment for thread ID: ${threadId}`);

    return await updateIssueComment({
      body: tiptapMessage,
      issueCommentId: linkedComment.comment.id,
    });
  }

  const linkedCommentMetadata = {
    url: threadId,
    sourceId: threadId,
    sourceData: sourceMetadata,
  };

  return createIssueComment({
    issueId,
    body: tiptapMessage,
    parentId,
    sourceMetadata,
    linkCommentMetadata: linkedCommentMetadata,
  });
};
