import {
  ActionEventPayload,
  createIssueComment,
  getLabels,
  Label,
} from '@tegonhq/sdk';
import axios from 'axios';

import {
  convertMarkdownToTiptapJson,
  convertTiptapJsonToText,
  LLMMappings,
} from '../utils';
import { PARTIAL_SOLUTION_PROMPT } from '../utils';

export const bugSuggestion = async (actionPayload: ActionEventPayload) => {
  const { modelId: issueId, action } = actionPayload;

  const { data: actionInput } = action;

  //   const issue = await getIssueById({ issueId });

  const issue = (
    await axios.get(`http://localhost:3000/api/v1/issues/${issueId}`)
  ).data;

  if (issue.labelIds.lengthr === 0) {
    return null;
  }
  const techStack = actionInput.inputs.techStack;

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
        content: `[INPUT] bug_description: ${convertTiptapJsonToText(issue.description)}
  tech_stack: ${techStack}`,
      },
    ],
    llmModel: LLMMappings.GPT35TURBO,
    model: 'BugSuggestion',
    workspaceId: issue.team.workspaceId,
  };

  // const aiResponse = await getAIRequest(requestData);
  const aiResponse = (
    await axios.post(`http://localhost:3000/api/v1/ai_requests`, requestData)
  ).data;

  const pattern = /\[OUTPUT\]\s*([\s\S]*)/;
  const match = aiResponse.match(pattern);

  let response;
  if (match) {
    [, response] = match;
  } else {
    response = null;
  }

  if (response) {
    const tiptapJson = await convertMarkdownToTiptapJson(response);

    return await createIssueComment({
      issueId,
      body: tiptapJson,
    });
  }
  return null;
};
