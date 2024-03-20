/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IntegrationName, Issue, LinkedIssue, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import OpenAI from 'openai';

import {
  getBotAccessToken,
  getReponse,
  sendGithubFirstComment,
  sendGithubPRFirstComment,
  upsertGithubIssue,
} from 'modules/integrations/github/github.utils';
import { IssueHistoryData } from 'modules/issue-history/issue-history.interface';

import {
  CreateIssueInput,
  IssueAction,
  IssueWithRelations,
  LinkIssueInput,
  LinkedIssueSubType,
  UpdateIssueInput,
  githubIssueRegex,
  githubPRRegex,
  titlePrompt,
} from './issues.interface';

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
  issueData: CreateIssueInput | UpdateIssueInput,
): Promise<string> {
  if (issueData.title) {
    return issueData.title;
  } else if (issueData.description) {
    const chatCompletion: OpenAI.Chat.ChatCompletion =
      await openaiClient.chat.completions.create({
        messages: [
          { role: 'system', content: titlePrompt },
          { role: 'user', content: issueData.description },
        ],
        model: 'gpt-3.5-turbo',
      });
    return chatCompletion.choices[0].message.content;
  }
  return '';
}

export async function getLastIssueNumber(
  prisma: PrismaService,
  teamId: string,
): Promise<number> {
  const lastIssue = await prisma.issue.findFirst({
    where: { teamId },
    orderBy: { number: 'desc' },
  });
  return lastIssue?.number ?? 0;
}

export async function handleTwoWaySync(
  prisma: PrismaService,
  issue: IssueWithRelations,
  action: IssueAction,
  userId: string,
) {
  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: {
      settings: {
        path: [IntegrationName.Github, 'repositoryMappings'],
        array_contains: [{ teamId: issue.teamId, bidirectional: true }],
      } as Prisma.JsonFilter,
    },
    include: {
      integrationDefinition: true,
      workspace: true,
    },
  });

  if (integrationAccount) {
    // Two-way sync is enabled for this team
    // Perform the necessary sync operations here
    // ...

    switch (action) {
      case IssueAction.CREATED: {
        const githubIssue = await upsertGithubIssue(
          prisma,
          issue,
          integrationAccount,
          userId,
        );

        await prisma.linkedIssue.create({
          data: {
            url: githubIssue.html_url,
            sourceId: githubIssue.id.toString(),
            source: {
              type: IntegrationName.Github,
              subType: LinkedIssueSubType.GithubIssue,
            },
            sourceData: {
              id: githubIssue.id.toString(),
              title: githubIssue.title,
              apiUrl: githubIssue.url,
            },
            issueId: issue.id,
            createdById: userId,
          },
        });

        await sendGithubFirstComment(
          prisma,
          integrationAccount,
          issue,
          githubIssue.id.toString(),
        );
        break;
      }

      case IssueAction.UPDATED: {
        await upsertGithubIssue(prisma, issue, integrationAccount, userId);
      }
    }
  }
}

export function getLinkType(url: string): LinkedIssueSubType | null {
  if (githubIssueRegex.test(url)) {
    return LinkedIssueSubType.GithubIssue;
  } else if (githubPRRegex.test(url)) {
    return LinkedIssueSubType.GithubPullRequest;
  }
  return LinkedIssueSubType.ExternalLink;
}

export function isValidLinkUrl(linkData: LinkIssueInput): boolean {
  const { url, type } = linkData;
  if (type === LinkedIssueSubType.GithubIssue) {
    return githubIssueRegex.test(url);
  } else if (type === LinkedIssueSubType.GithubPullRequest) {
    return githubPRRegex.test(url);
  } else if (type === LinkedIssueSubType.ExternalLink) {
    return true;
  }

  return false;
}

export function convertToAPIUrl(linkData: LinkIssueInput): string {
  const { url, type } = linkData;

  if (
    type === LinkedIssueSubType.GithubIssue ||
    type === LinkedIssueSubType.GithubPullRequest
  ) {
    const matches = url.match(
      /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(issues|pull)\/(\d+)$/,
    );

    if (matches) {
      const [, owner, repo, issueOrPull, number] = matches;
      return `https://api.github.com/repos/${owner}/${repo}/${issueOrPull === 'pull' ? 'pulls' : 'issues'}/${number}`;
    }
  }

  return url;
}

export async function getLinkedIssueWithUrl(
  prisma: PrismaService,
  linkData: LinkIssueInput,
  teamId: string,
  issueId: string,
  userId: string,
): Promise<LinkedIssue> {
  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: {
      settings: {
        path: [IntegrationName.Github, 'repositoryMappings'],
        array_contains: [{ teamId, bidirectional: true }],
      } as Prisma.JsonFilter,
    },
    include: {
      integrationDefinition: true,
      workspace: true,
    },
  });

  if (
    !integrationAccount ||
    linkData.type === LinkedIssueSubType.ExternalLink
  ) {
    return await prisma.linkedIssue.create({
      data: { url: linkData.url, issueId, createdById: userId },
    });
  }

  const accessToken = await getBotAccessToken(prisma, integrationAccount);
  const response =
    (await getReponse(convertToAPIUrl(linkData), accessToken)).data ?? {};

  if (!response) {
    return await prisma.linkedIssue.create({
      data: {
        url: linkData.url,
        issueId,
        createdById: userId,
        sourceData: linkData as unknown as Prisma.InputJsonValue,
      },
    });
  }

  const isGithubIssue = linkData.type === LinkedIssueSubType.GithubIssue;
  const isGithubPR = linkData.type === LinkedIssueSubType.GithubPullRequest;

  const sourceData = isGithubPR
    ? {
        branch: response.head.ref,
        id: response.id.toString(),
        closedAt: response.closed_at,
        createdAt: response.created_at,
        updatedAt: response.updated_at,
        number: response.number,
        state: response.state,
        title: response.title,
        apiUrl: response.url,
        mergedAt: response.merged_at,
      }
    : {
        id: response.id.toString(),
        title: response.title,
        apiUrl: response.url,
      };

  const source = isGithubPR
    ? {
        type: IntegrationName.Github,
        subType: LinkedIssueSubType.GithubPullRequest,
        pullRequestId: response.id,
      }
    : {
        type: IntegrationName.Github,
        subType: LinkedIssueSubType.GithubIssue,
      };

  const linkedIssue = await prisma.linkedIssue.create({
    data: {
      url: response.html_url,
      issueId,
      sourceId: response.id.toString(),
      source,
      sourceData,
      createdById: userId,
    },
    include: { issue: { include: { team: { include: { workspace: true } } } } },
  });

  if (isGithubIssue) {
    await sendGithubFirstComment(
      prisma,
      integrationAccount,
      linkedIssue.issue,
      linkedIssue.sourceId,
    );
  } else if (isGithubPR) {
    await sendGithubPRFirstComment(
      prisma,
      integrationAccount,
      linkedIssue.issue.team,
      linkedIssue.issue,
      response.comments_url,
    );
  }

  return linkedIssue;
}
