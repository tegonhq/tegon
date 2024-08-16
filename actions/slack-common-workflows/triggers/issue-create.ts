import axios from 'axios';

import { SlackCreateIssuePayload } from '../types';
import {
  createLinkIssueComment,
  getIssueMessageModal,
  sendSlackMessage,
} from '../utils';
import { info } from '@tegonhq/sdk';

export const slackIssueCreate = async (payload: SlackCreateIssuePayload) => {
  const { integrationAccount, sessionData, issueData } = payload;

  // Extract issueInput, sourceMetadata, and userId from issueData
  const { issueInput, sourceMetadata } = issueData;

  info('Creating issue with issueInput', { issueInput });

  const createdIssue = (
    await axios.post(
      `${process.env.BACKEND_HOST}/v1/issues?teamId=${sessionData.teamId}`,

      { ...issueInput },
    )
  ).data;

  const workspaceId = createdIssue.team.workspaceId;

  info('Issue created successfully', { id: createdIssue.id });
  // Prepare the payload for sending a Slack message
  const messagePayload = {
    channel: sessionData.channelId,
    text: `<@${sessionData.messagedById}> created a Issue`,
    attachments: await getIssueMessageModal(createdIssue, workspaceId),
    ...(sessionData.threadTs ? { thread_ts: sessionData.threadTs } : {}),
  };

  info('Sending Slack message with payload', { messagePayload });

  // Send the Slack message
  const messageResponse = await sendSlackMessage(
    integrationAccount,
    messagePayload,
  );

  if (messageResponse.ok) {
    info('Slack message sent successfully', { messageResponse });

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
