import {
  getIssueComment,
  ActionEventPayload,
  getLinkedIssuesByIssueId,
  JsonObject,
  updateIssueComment,
} from '@tegonhq/sdk';
import axios from 'axios';

export const commentSync = async (actionPayload: ActionEventPayload) => {
  const {
    integrationAccounts: { whatsapp: integrationAccount },
    modelId: issueCommentId,
  } = actionPayload;

  const integrationDefinitionSlug =
    integrationAccount.integrationDefinition.slug;

  const issueComment = await getIssueComment({ issueCommentId });

  const sourceData = issueComment.sourceMetadata as JsonObject;

  if (sourceData?.synced === true) {
    return {
      message: `Comment is already synced`,
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

  // Send a POST request to the Slack API to post the message
  await axios.post('http://localhost:3002/messages/broadcast', {
    clientId: integrationAccount.accountId,
    payload: {
      type: 'ISSUE_COMMENT',
      chatId: parentSourceMetadata.chatId._serialized,
      message: issueComment.bodyMarkdown,
      issueCommentId: issueComment.id,
    },
  });

  await updateIssueComment({
    issueCommentId,
    sourceMetadata: { synced: false },
  });
  return null;
};
