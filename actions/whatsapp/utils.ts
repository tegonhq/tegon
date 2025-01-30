import {
  getAIRequest,
  getCompaniesByWorkspace,
  getIssueCommentReplies,
  JsonObject,
  LinkedIssue,
  LLMMappings,
  Workflow,
} from '@tegonhq/sdk';
import { CREATE_TICKET_PROMPT } from 'prompts/create-ticket-prompt';
import { GROUP_COMPANY_PROMPT } from 'prompts/group-company-prompt';

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

export async function getCompanyId(workspaceId: string, groupName: string) {
  const companies = await getCompaniesByWorkspace();

  const companyList = companies.map((company) => ({
    name: company.name,
    id: company.id,
  }));

  const requestData = {
    messages: [
      {
        role: 'user',
        content: GROUP_COMPANY_PROMPT.replace(
          /{{COMPANIES}}|{{GROUP_NAME}}/g,
          (match) =>
            match === '{{COMPANIES}}' ? JSON.stringify(companyList) : groupName,
        ),
      },
    ],
    llmModel: LLMMappings.GPT35TURBO,
    model: 'GroupCompanyName',
    workspaceId,
  };

  const aiResponse = await getAIRequest(requestData);

  // Extract the answer section from the AI response
  const answerMatch = aiResponse.match(/<answer>(.*?)<\/answer>/s);
  if (!answerMatch) {
    return null;
  }

  try {
    const parsedResponse = JSON.parse(answerMatch[1]);
    return parsedResponse.id || null;
  } catch (error) {
    return null;
  }
}

export async function isCreateTicket(
  workspaceId: string,
  linkedIssue: LinkedIssue,
  message: string,
) {
  let previousMessage = '';
  if (linkedIssue) {
    const linkedSourceData = linkedIssue.sourceData as JsonObject;

    const issueComments = await getIssueCommentReplies({
      issueCommentId: linkedSourceData.syncedCommentId as string,
    });

    previousMessage =
      issueComments.length > 0
        ? issueComments[issueComments.length - 1].bodyMarkdown
        : '';
  }
  const requestData = {
    messages: [
      {
        role: 'user',
        content: CREATE_TICKET_PROMPT.replace(
          /{{PREVIOUS_MESSAGE}}|{{CURRENT_MESSAGE}}/g,
          (match) =>
            match === '{{PREVIOUS_MESSAGE}}' ? previousMessage : message,
        ),
      },
    ],
    llmModel: LLMMappings.GPT35TURBO,
    model: 'GroupCompanyName',
    workspaceId,
  };

  const aiResponse = await getAIRequest(requestData);

  const createTicketMatch = aiResponse.match(/<answer>(.*?)<\/answer>/s);
  if (!createTicketMatch) {
    return true;
  }

  try {
    const parsedResponse = JSON.parse(createTicketMatch[1]);
    return parsedResponse.create_ticket;
  } catch (error) {
    return true;
  }
}
