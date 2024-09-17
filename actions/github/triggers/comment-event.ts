import {
  ActionEventPayload,
  createIssueComment,
  getLinkedComment,
  getLinkedIssueBySource,
  JsonObject,
  logger,
} from '@tegonhq/sdk';
import axios from 'axios';
import { getGithubHeaders } from 'utils';

export const commentEvent = async (actionPayload: ActionEventPayload) => {
  const {
    eventBody,
    userId,
    integrationAccounts: { github: integrationAccount },
  } = actionPayload;

  const { botToken } = integrationAccount.integrationConfiguration;
  // Get the linked issue by the GitHub issue ID
  let linkedIssue = await getLinkedIssueBySource({
    sourceId: eventBody.issue.id.toString(),
  });

  if (!linkedIssue && eventBody.issue.pull_request) {
    const pullRequest = (
      await axios.get(
        eventBody.issue.pull_request.url,
        getGithubHeaders(botToken),
      )
    ).data;

    linkedIssue = await getLinkedIssueBySource({
      sourceId: pullRequest.id.toString(),
    });
  }

  if (!linkedIssue) {
    logger.log(
      `No linked issue found for GitHub issue ID: ${eventBody.issue.id}`,
    );
    return undefined;
  }

  const sourceData = linkedIssue.sourceData as JsonObject;
  const syncingLinkedIssue =
    sourceData.type === integrationAccount.integrationDefinition.slug &&
    linkedIssue.sync === true;

  if (!syncingLinkedIssue) {
    return { message: 'Linked issue is not sync with source' };
  }

  const { issueId, sourceData: linkedIssueSource } = linkedIssue;
  // Finding parent id from issue synced comment
  const parentId = (linkedIssueSource as Record<string, string>)
    .syncedCommentId;

  const linkedComment = await getLinkedComment({
    sourceId: eventBody.comment.id.toString(),
  });

  switch (eventBody.action) {
    case 'created':
      if (linkedComment) {
        logger.log(
          `Linked comment already exists for GitHub comment ID: ${eventBody.comment.id}`,
        );
        return linkedComment.comment;
      }
      const sourceMetadata = {
        id: integrationAccount.id,
        type: integrationAccount.integrationDefinition.slug,
        userDisplayName: eventBody.sender.login,
      };

      const linkCommentMetadata = {
        url: eventBody.comment.html_url,
        sourceId: eventBody.comment.id.toString(),
        sourceData: {
          id: eventBody.comment.id,
          body: eventBody.comment.body,
          displayUserName: eventBody.comment.user.login,
          apiUrl: eventBody.comment.url,
        },
        createdById: userId,
      };

      return await createIssueComment({
        issueId,
        parentId,
        bodyMarkdown: eventBody.comment.body,
        sourceMetadata,
        linkCommentMetadata,
      });

    default:
      logger.log(`Event body action ${eventBody.action} is not recognized`);
      return {
        message: `Event body action ${eventBody.action} is not recognized`,
      };
  }
};
