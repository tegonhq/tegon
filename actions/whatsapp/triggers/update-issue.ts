import {
  ActionEventPayload,
  getIssueById,
  getLinkedIssuesByIssueId,
  getWorkflowsByTeam,
  JsonObject,
} from '@tegonhq/sdk';
import axios from 'axios';

export const issueSync = async (actionPayload: ActionEventPayload) => {
  const { changedData } = actionPayload;

  if (!changedData.stateId) {
    return {
      message: 'No state change detected',
    };
  }

  const integrationAccount = actionPayload.integrationAccounts.whatsapp;

  const issue = await getIssueById({ issueId: actionPayload.modelId });

  const workflows = await getWorkflowsByTeam({ teamId: issue.teamId });

  const workflowState = workflows.find(
    (workflow) => workflow.id === changedData.stateId,
  );

  if (!workflowState) {
    return {
      message: 'Workflow state not found',
    };
  }

  const isDone = workflowState.category === 'COMPLETED';

  if (isDone) {
    const message = `This ticket #${issue.number} is closed`;
    const linkedIssues = await getLinkedIssuesByIssueId({ issueId: issue.id });

    linkedIssues.map(async (linkedIssue) => {
      const sourceData = linkedIssue.sourceData as JsonObject;
      const clientId = integrationAccount.accountId;
      const chatId = sourceData.chatId as JsonObject;

      if (sourceData.type === integrationAccount.integrationDefinition.slug) {
        await axios.post(
          `${process.env.SOCKET_SERVER_URL}/messages/broadcast`,
          {
            clientId,
            payload: {
              chatId: chatId._serialized,
              message,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      }
    });
  }

  return {
    message: `Issue state is ${isDone ? 'completed' : 'not completed'}`,
  };
};
