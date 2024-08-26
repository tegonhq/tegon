import {
  ActionEventPayload,
  getUsers,
  getWorkflowsByTeam,
  Issue,
  Label,
} from '@tegonhq/sdk';
import axios from 'axios';

import { parseExpression } from 'cron-parser';
import { IssueViewSummaryPrompt, LLMMappings } from 'types';
import { getSlackHeaders } from 'utils';

function getLastRunTime(cronExpression: string): Date {
  const interval = parseExpression(cronExpression);
  const lastRunTime = interval.prev().toDate();
  return lastRunTime;
}

export const viewSummary = async (actionPayload: ActionEventPayload) => {
  const {
    integrationAccounts: { slack: integrationAccount },
    modelId: viewId,
    action,
  } = actionPayload;

  const { cron: actionCron, data: actionInput } = action;

  const view = (await axios.get(`http://localhost:3000/api/v1/views/${viewId}`))
    .data;

  // Find the channel mapping for the given channel ID
  const channelMapping = actionInput.input.channelTeamMappings.find(
    ({ teamId: mappedTeamId }: { teamId: string }) =>
      mappedTeamId === view.teamId,
  );

  console.log(channelMapping);
  // If no channel mapping is found, return undefined
  if (!channelMapping) {
    return undefined;
  }

  const lastRunTime = getLastRunTime(actionCron);

  view.filters['updatedAt'] = { filterType: 'GTE', value: lastRunTime };
  view.filters['teamId'] = { filterType: 'IS', value: [view.teamId] };
  //   const issues = await getIssuesByFilter({filters: view.filters, workspaceId: view.workspaceId})
  const issues = (
    await axios.post(`http://localhost:3000/api/v1/issues/filter`, {
      filters: view.filters,
      workspaceId: view.workspaceId,
    })
  ).data;

  //   const labels = await getAllLabels({workspaceId: view.workspaceId})

  const labels = (
    await axios.get(
      `http://localhost:3000/api/v1/labels?workspaceId=${view.workspaceId}`,
    )
  ).data;
  const labelMap = Object.fromEntries(
    labels.map((label: Label) => [label.id, label.name]),
  );

  const workflows = await getWorkflowsByTeam({ teamId: view.teamId });

  const workflowMap = Object.fromEntries(
    workflows.map((workflow) => [workflow.id, workflow.name]),
  );

  const assigneeIds: string[] = issues
    .map((issue: Issue) => issue.assigneeId)
    .filter((assigneeId: string) => assigneeId !== null);

  const uniqueAssigneeIds = [...new Set(assigneeIds)];

  let assigneeMap: Record<string, string> = {};

  if (uniqueAssigneeIds.length > 0) {
    const users = await getUsers({ userIds: uniqueAssigneeIds });
    assigneeMap = Object.fromEntries(
      users.map((user) => [user.id, user.fullname]),
    );
  }

  const priorities = ['No Priority', 'Urgent', 'High', 'Medium', 'Low'];

  const transformedIssues = issues.map((issue: Issue) => ({
    title: issue.title,
    number: issue.number,
    labels: issue.labelIds.map((labelId) => labelMap[labelId]),
    assignee: assigneeMap[issue.assigneeId],
    state: workflowMap[issue.stateId],
    priority: priorities[issue.priority],
  }));

  const requestData = {
    messages: [
      { role: 'system', content: IssueViewSummaryPrompt },
      {
        role: 'user',
        content: `[INPUT] user_queries: ${actionInput.input.prompt}
issues: ${JSON.stringify(transformedIssues)}`,
      },
    ],
    llmModel: LLMMappings.GPT35TURBO,
    model: 'IssueViewSummary',
    workspaceId: view.workspaceId,
  };

  // const aiResponse = await getAIRequest(requestData);
  const aiResponse = (
    await axios.post(`http://localhost:3000/api/v1/ai_requests`, requestData)
  ).data;

  const pattern = /\[OUTPUT\]\s*summary:\s*(\[.*\])/;
  const match = aiResponse.match(pattern);

  let summaryPoints: string[] = [];
  if (match) {
    try {
      summaryPoints = JSON.parse(match[1]);
    } catch {
      summaryPoints = [match[1]];
    }
  }

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const slackBlocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Summary*: *${view.name}* - *${formattedDate}*`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: summaryPoints.map((point) => `• ${point}`).join('\n'),
      },
    },
  ];

  // Send a POST request to the Slack API to post the message
  const response = (
    await axios.post(
      'https://slack.com/api/chat.postMessage',
      {
        channel: channelMapping.channelId,
        blocks: slackBlocks,
      },
      getSlackHeaders(integrationAccount),
    )
  ).data;

  return { issues: response };
};
