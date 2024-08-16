import {
  IntegrationAccount,
  IssueComment,
  IssueCommentCreateActionPayload,
} from '@tegonhq/types';
import { AbortTaskRunError } from '@trigger.dev/sdk/v3';
import axios from 'axios';

import { convertTiptapJsonToSlackBlocks, getSlackHeaders } from '../utils';

export const commentSync = async (
  integrationAccounts: Record<string, IntegrationAccount>,
  data: IssueCommentCreateActionPayload,
) => {
  const { issueCommentId } = data;
  const { slack: integrationAccount } = integrationAccounts;
  const integrationDefinitionName =
    integrationAccount.integrationDefinition.name;

  const issueComment: IssueComment = (
    await axios.get(
      `${process.env.BACKEND_HOST}/v1/issue_comments/${issueCommentId}`,
    )
  ).data;

  if (issueComment.sourceMetadata) {
    return {
      message: `Ignoring comment created from source`,
    };
  }

  const parentIssueComment = issueComment.parent;
  if (!parentIssueComment || !parentIssueComment.sourceMetadata) {
    return {
      message: 'Parent comment does not exist or has empty source metadata',
    };
  }

  // Extract the source metadata from the parent issue comment
  const parentSourceData = parentIssueComment.sourceMetadata as Record<
    string,
    string
  >;

  const user = (await axios.get(`${process.env.BACKEND_HOST}/v1/users`)).data;

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
      type: integrationDefinitionName,
      userDisplayName: message.username ? message.username : message.user,
    };

    // Create a linked comment in the database
    return (
      await axios.post(
        `${process.env.BACKEND_HOST}/v1/issue_comments/linked_comment`,
        {
          url: threadId,
          sourceId: threadId,
          source: {
            type: integrationDefinitionName,
            integrationAccountId: integrationAccount.id,
          },
          commentId: issueComment.id,
          sourceData,
        },
      )
    ).data;
  }

  throw new AbortTaskRunError(
    `Sending message to slack failed. This is the response ${JSON.stringify(response.data)}`,
  );
};
