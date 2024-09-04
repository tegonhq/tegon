import {
  ActionEventPayload,
  createIssueComment,
  getLabels,
  Label,
  getIssueById,
  getAIRequest,
} from '@tegonhq/sdk';

import {
  convertMarkdownToTiptapJson,
  convertTiptapJsonToText,
  LLMMappings,
} from '../utils';
import { PARTIAL_SOLUTION_PROMPT } from '../utils';

export const bugEnricher = async (actionPayload: ActionEventPayload) => {
  const { modelId: issueId } = actionPayload;

  const issue = await getIssueById({ issueId });

  if (issue.labelIds.length === 0) {
    return null;
  }

  const labels = await getLabels({
    workspaceId: issue.team.workspaceId,
    teamId: issue.teamId,
  });

  const labelMap = Object.fromEntries(
    labels.map((label: Label) => [label.id, label.name]),
  );

  const hasBugLabel = issue.labelIds.some(
    (labelId: string) => labelMap[labelId].toLowerCase() === 'bug',
  );

  if (!hasBugLabel) {
    return null;
  }

  const requestData = {
    messages: [
      { role: 'system', content: PARTIAL_SOLUTION_PROMPT },
      {
        role: 'user',
        content: `[INPUT] bug_description: ${convertTiptapJsonToText(issue.description)}`,
      },
    ],
    llmModel: LLMMappings.GPT35TURBO,
    model: 'BugSuggestion',
    workspaceId: issue.team.workspaceId,
  };

  const aiResponse = await getAIRequest(requestData);

  const pattern = /\[OUTPUT\]\s*([\s\S]*)/;
  const match = aiResponse.match(pattern);

  let response;
  if (match) {
    [, response] = match;
  } else {
    response = null;
  }

  if (response) {
    const tiptapJson = convertMarkdownToTiptapJson(response);

    return await createIssueComment({
      issueId,
      body: tiptapJson,
    });
  }
  return null;
};
