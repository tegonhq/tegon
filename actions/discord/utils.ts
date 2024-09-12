import {
  createIssueComment,
  logger,
  updateLinkedIssueBySource,
  UpdateLinkedIssueDto,
  Workflow,
} from '@tegonhq/sdk';
import { Message } from 'discord.js';

export function getStateId(action: string, workflowStates: Workflow[]) {
  const category =
    action === 'opened' ? 'TRIAGE' : action === 'closed' ? 'COMPLETED' : null;
  if (category) {
    const workflow = workflowStates.find(
      (workflow) => workflow.category === category,
    );
    return workflow?.id;
  }

  return undefined;
}

export async function createLinkIssueComment(
  linkIssueInput: UpdateLinkedIssueDto,
  threadId: string,
  threadResponse: Message,
  channelName: string,
  issueId: string,
  // TODO: Update this type to be more specific than `any`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sourceMetadata: any,
) {
  const commentBody = `Discord thread in #${channelName}`;

  // Merge provided metadata with message-specific details
  const commentSourceMetadata = {
    ...sourceMetadata,
    threadId,
    threadMessageId: threadResponse.id,
  };

  // Post the comment to the backend and capture the response
  const issueComment = await createIssueComment({
    issueId,
    body: commentBody,
    sourceMetadata: commentSourceMetadata,
  });

  // Log the successful creation of the issue comment
  logger.info(`Issue comment created successfully ${issueComment.id}`);

  // Update the linked issue input with the new comment ID and message timestamp
  linkIssueInput.sourceData.threadId = threadId;
  linkIssueInput.sourceData.syncedCommentId = issueComment.id;

  // Update the linked issue source with the new data
  await updateLinkedIssueBySource({
    sourceId: linkIssueInput.sourceId,
    sourceData: linkIssueInput.sourceData,
  });

  // Log the successful update of the linked issue
  logger.info('Linked issue updated successfully');
}
