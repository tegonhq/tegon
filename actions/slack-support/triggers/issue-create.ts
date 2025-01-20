import { SlackCreateIssuePayload } from '../types';
import {
  createLinkIssueComment,
  getIssueMessageModal,
  sendSlackMessage,
} from '../utils';
import {
  createIssue,
  createIssueComment,
  getTeamById,
  logger,
} from '@tegonhq/sdk';

export const slackIssueCreate = async (payload: SlackCreateIssuePayload) => {
  const { integrationAccount, sessionData, issueData } = payload;

  // Extract issueInput, sourceMetadata, and userId from issueData
  const { issueInput, sourceMetadata } = issueData;

  logger.info('Creating issue with issueInput', { issueInput });

  const createdIssue = await createIssue({
    teamId: sessionData.teamId,
    ...issueInput,
  });

  const team = await getTeamById({ teamId: createdIssue.teamId });

  logger.info('Issue created successfully', { id: createdIssue.id });
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
    const { issueComment, commentSourceMetadata } =
      await createLinkIssueComment(
        messageResponse,
        integrationAccount,
        issueInput.linkIssueData,
        sessionData.channelId as string,
        createdIssue.id,
        sourceMetadata,
      );

    await createIssueComment({
      issueId: createdIssue.id,
      body: sourceMetadata.descriptionText,
      parentId: issueComment.id,
      sourceMetadata: commentSourceMetadata,
    });
  }

  return createdIssue;
};
