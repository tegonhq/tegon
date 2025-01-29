import type { EventBody, IntegrationAccount, JsonObject } from '@tegonhq/sdk';

import {
  getWorkflowsByTeam,
  createIssue,
  createIssueComment,
  updateLinkedIssueBySource,
  getLinkedIssueBySource,
} from '@tegonhq/sdk';

import { getCompanyId, getStateId, isCreateTicket } from '../utils';
import axios from 'axios';

export const whatsappTriage = async (
  integrationAccount: IntegrationAccount,
  userId: string,
  eventBody: EventBody,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any,
) => {
  const {
    body,
    messageId: { _serialized: sourceId },
    messageId,
    chat: { name: username, id: chatId },
    from,
  } = eventBody;

  // Skip status messages from WhatsApp
  if (from.includes('status@')) {
    return 'Skipping status message';
  }
  // Find the channel mapping for the given channel ID
  const teamId = action.data.inputs.teamId;

  // Check if the thread is already linked to an existing issue
  const workflowStates = await getWorkflowsByTeam({ teamId });

  const stateId = getStateId('opened', workflowStates);

  const whatsappUsername = username || 'Whatsapp';

  // Create source metadata object
  const sourceMetadata = {
    id: integrationAccount.id,
    type: integrationAccount.integrationDefinition.slug,
    messageId,
    chatId,
    userDisplayName: whatsappUsername,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const linkIssueData = {
    url: `https://web.whatsapp.com/${sourceId}`,
    sourceId,
    sourceData: {
      type: integrationAccount.integrationDefinition.slug,
      messageId,
      chatId,
      title: `Whatsapp message from: ${whatsappUsername}`,
      userDisplayName: whatsappUsername,
    },
    createdById: userId,
  };

  // Create issue input data
  const issueInput = {
    title: body,
    stateId,
    isBidirectional: true,
    subscriberIds: [...(userId ? [userId] : [])],
    teamId,
    sourceMetadata,
    linkIssueData,
  };

  // Check for existing issue with this chatId
  const existingIssues = await getLinkedIssueBySource({
    sourceId: chatId._serialized,
  });

  const existingIssue =
    existingIssues.length > 0
      ? existingIssues.reduce((latest, current) => {
          return latest.createdAt > current.createdAt ? latest : current;
        })
      : null;

  const createTicket = await isCreateTicket(
    integrationAccount.workspaceId,
    existingIssue,
    body,
  );
  if (!createTicket) {
    return { message: 'Ignoring casual message' };
  }

  if (existingIssue) {
    const existingIssueState = workflowStates.find(
      (state) => state.id === existingIssue.issue.stateId,
    );
    if (existingIssueState.category !== 'COMPLETED') {
      // Create a comment on the existing issue instead
      const commentBody = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: body,
              },
            ],
          },
        ],
      };
      const exisitingSourcedata = existingIssue.sourceData as JsonObject;

      return await createIssueComment({
        issueId: existingIssue.issueId,
        parentId: exisitingSourcedata.syncedCommentId as string,
        body: JSON.stringify(commentBody),
        sourceMetadata: { ...sourceMetadata, synced: true },
      });
    }
  }

  const companyId = await getCompanyId(
    integrationAccount.workspaceId,
    whatsappUsername,
  );
  const supportData = {
    email: chatId._serialized,
    name: username,
    source: 'Whatsapp',
    companyId,
  };

  const createdIssue = await createIssue({ ...issueInput, supportData });

  await axios.post('http://localhost:3002/messages/broadcast', {
    clientId: integrationAccount.accountId,
    payload: {
      type: 'ISSUE_CREATED',
      chatId: chatId._serialized,
      message: `Support ticket is created #${createdIssue.number}`,
    },
  });

  // Create Link Comment
  const issueComment = await createIssueComment({
    issueId: createdIssue.id,
    body: `Whatsapp conversation in #${whatsappUsername}`,
    sourceMetadata: { ...sourceMetadata, synced: true },
  });

  const linkSourceData = {
    ...linkIssueData.sourceData,
    syncedCommentId: issueComment.id,
  };

  // Update the linked issue source with the new data
  await updateLinkedIssueBySource({
    sourceId,
    sourceData: linkSourceData,
  });

  const commentBody = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: body,
          },
        ],
      },
    ],
  };
  await createIssueComment({
    issueId: createdIssue.id,
    body: JSON.stringify(commentBody),
    parentId: issueComment.id,
    sourceMetadata: { ...sourceMetadata, synced: true },
  });

  return createIssue;
};
