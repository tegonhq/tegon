import {
  getIssueComment,
  getUsers,
  createLinkedIssueComment,
  ActionEventPayload,
  RoleEnum,
  getLinkedIssuesByIssueId,
} from '@tegonhq/sdk';
import axios from 'axios';

import { convertTiptapJsonToSlackBlocks, getSlackHeaders } from '../utils';

export const commentSync = async (actionPayload: ActionEventPayload) => {
  const {
    integrationAccounts: { slack: integrationAccount },
    modelId: issueCommentId,
  } = actionPayload;

  const integrationDefinitionSlug =
    integrationAccount.integrationDefinition.slug;

  const issueComment = await getIssueComment({ issueCommentId });

  const userRole = (
    await getUsers({
      userIds: [issueComment.updatedById],
    })
  )[0].role;

  if (userRole === RoleEnum.BOT) {
    return {
      message: `Ignoring comment created from Bot`,
    };
  }

  const parentIssueComment = issueComment.parent;
  const parentSourceMetadata = parentIssueComment
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (parentIssueComment.sourceMetadata as Record<string, any>)
    : {};

  if (
    !parentIssueComment ||
    !parentSourceMetadata ||
    parentSourceMetadata.type !== integrationDefinitionSlug
  ) {
    return {
      message: 'Parent comment does not exist or has empty source metadata',
    };
  }

  const linkedIssues = await getLinkedIssuesByIssueId({
    issueId: issueComment.issueId,
  });

  const syncingLinkedIssue = linkedIssues.find((linkedIssue) => {
    const sourceData = linkedIssue.sourceData as Record<string, string>;
    return (
      sourceData.type === integrationDefinitionSlug && linkedIssue.sync === true
    );
  });

  if (!syncingLinkedIssue) {
    return { message: 'Linked issue is not sync with source' };
  }

  // Extract the source metadata from the parent issue comment
  const parentSourceData = parentIssueComment.sourceMetadata as Record<
    string,
    string
  >;

  const user = (
    await getUsers({ userIds: [issueComment.userId as string] })
  )[0];

  // Send a POST request to the Slack API to post the message
  const response = await axios.post(
    'https://slack.com/api/chat.postMessage',
    {
      channel: parentSourceData.channelId,
      thread_ts: parentSourceData.parentTs || parentSourceData.idTs,
      blocks: convertTiptapJsonToSlackBlocks(issueComment.body),
      username: `${user.fullname} (via Tegon)`,
      // TODO(Manoj): Add User Icon
    },
    getSlackHeaders(integrationAccount),
  );

  // Check if the response from Slack API is successful
  if (response.data.ok) {
    const messageData = response.data;
    // Determine the message based on the subtype
    const message =
      messageData.subtype === 'message_changed'
        ? messageData.message
        : messageData;
    // Generate the thread ID using the channel and message timestamp
    const threadId = `${messageData.channel}_${message.ts}`;
    // Prepare the source data object
    const sourceData = {
      idTs: message.ts,
      parentTs: message.thread_ts,
      channelId: messageData.channel,
      channelType: messageData.channel_type,
      type: integrationDefinitionSlug,
      userDisplayName: message.username ? message.username : message.user,
    };

    // Create a linked comment in the database
    return await createLinkedIssueComment({
      url: threadId,
      sourceId: threadId,
      commentId: issueComment.id,
      sourceData,
    });
  }

  return null;
};
