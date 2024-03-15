/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IntegrationName, Issue, Prisma } from '@prisma/client';
import OpenAI from 'openai';

import { IssueHistoryData } from 'modules/issue-history/issue-history.interface';

import { IssueWithRelations, titlePrompt } from './issues.interface';
import { PrismaService } from 'nestjs-prisma';
import {
  createGithubIssue,
  sendGithubFirstComment,
} from 'modules/integrations/github/github.utils';

export async function getIssueDiff(
  newIssueData: Issue,
  currentIssueData: Issue,
): Promise<IssueHistoryData> {
  let issueHistoryData: IssueHistoryData = {} as IssueHistoryData;
  const keys = ['assigneeId', 'priority', 'parentId', 'stateId', 'estimate'];

  if (currentIssueData) {
    keys.forEach((key) => {
      const newIssueValue = getProperty(newIssueData, key as keyof Issue);
      const currentIssueValue = getProperty(
        currentIssueData,
        key as keyof Issue,
      );
      if (newIssueValue !== currentIssueValue) {
        const fromKey = `from${capitalize(key)}` as keyof IssueHistoryData;
        const toKey = `to${capitalize(key)}` as keyof IssueHistoryData;
        issueHistoryData = {
          ...issueHistoryData,
          [fromKey]: currentIssueValue,
          [toKey]: newIssueValue,
        };
      }
    });

    const currentLabelsSet = new Set(currentIssueData.labelIds || []);
    const newLabelsSet = new Set(newIssueData.labelIds || []);
    const addedLabels =
      [...newLabelsSet].filter((x) => !currentLabelsSet.has(x)) || [];
    const removedLabels =
      [...currentLabelsSet].filter((x) => !newLabelsSet.has(x)) || [];

    issueHistoryData.addedLabelIds = addedLabels;
    issueHistoryData.removedLabelIds = removedLabels;
  } else {
    keys.forEach((key) => {
      const toKey = `to${capitalize(key)}` as keyof IssueHistoryData;
      issueHistoryData = {
        ...issueHistoryData,
        [toKey]: getProperty(newIssueData, key as keyof Issue),
      };
    });
    issueHistoryData.addedLabelIds = newIssueData.labelIds;
  }

  return issueHistoryData;
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function getIssueTitle(
  openaiClient: OpenAI,
  description: string,
): Promise<string> {
  const chatCompletion: OpenAI.Chat.ChatCompletion =
    await openaiClient.chat.completions.create({
      messages: [
        { role: 'system', content: titlePrompt },
        { role: 'user', content: description },
      ],
      model: 'gpt-3.5-turbo',
    });
  return chatCompletion.choices[0].message.content;
}

export async function handleTwoWaySync(
  prisma: PrismaService,
  issue: IssueWithRelations,
) {
  console.log('here');
  console.log(issue.teamId);

  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: {
      settings: {
        path: ['Github', 'repositoryMappings'],
        array_contains: {
          teamId: issue.teamId,
          bidirectional: true,
        },
      } as Prisma.JsonFilter,
    },
    include: {
      integrationDefinition: true,
      workspace: true,
    },
  });
  console.log(integrationAccount);

  if (integrationAccount) {
    // Two-way sync is enabled for this team
    // Perform the necessary sync operations here
    // ...

    const githubIssue = await createGithubIssue(
      prisma,
      issue,
      integrationAccount,
    );

    // Create a linkedIssue using Prisma
    await prisma.linkedIssues.create({
      data: {
        title: githubIssue.title,
        url: githubIssue.url,
        sourceId: githubIssue.id.toString(),
        source: { type: IntegrationName.Github },
        sourceData: { id: githubIssue.id.toString(), title: githubIssue.title },
        issueId: issue.id,
      },
    });

    await sendGithubFirstComment(
      prisma,
      integrationAccount,
      issue,
      githubIssue.id.toString(),
    );
  } else {
    console.log('integration account not found');
  }

  return issue;
}
