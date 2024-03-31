/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Logger } from '@nestjs/common';
import { IntegrationName, Issue, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import OpenAI from 'openai';

import {
  sendGithubFirstComment,
  upsertGithubIssue,
} from 'modules/integrations/github/github.utils';
import { IssueHistoryData } from 'modules/issue-history/issue-history.interface';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';

import {
  CreateIssueInput,
  IssueAction,
  IssueWithRelations,
  LinkIssueInput,
  LinkedIssueSubType,
  SubscribeType,
  UpdateIssueInput,
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
  logger: Logger,
  linkedIssueService: LinkedIssueService,
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
      isActive: true,
      deleted: null,
    },
    include: {
      integrationDefinition: true,
      workspace: true,
    },
  });

  if (integrationAccount) {
    logger.debug(`Found integration account for team ${issue.teamId}`);
    switch (action) {
      case IssueAction.CREATED: {
        logger.log(`Creating GitHub issue for Tegon issue ${issue.id}`);
        const githubIssue = await upsertGithubIssue(
          prisma,
          logger,
          issue,
          integrationAccount,
          userId,
        );

        logger.debug(
          `Linking GitHub issue ${githubIssue.id} to Tegon issue ${issue.id}`,
        );
        await linkedIssueService.createLinkIssueAPI({
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
        });

        logger.debug(`Sending first comment to GitHub issue ${githubIssue.id}`);
        await sendGithubFirstComment(
          prisma,
          logger,
          linkedIssueService,
          integrationAccount,
          issue,
          githubIssue.id.toString(),
        );
        break;
      }

      case IssueAction.UPDATED: {
        logger.debug(`Updating GitHub issue for Tegon issue ${issue.id}`);
        await upsertGithubIssue(
          prisma,
          logger,
          issue,
          integrationAccount,
          userId,
        );
      }
    }
  } else {
    logger.log(`No integration account found for team ${issue.teamId}`);
  }
}

export async function findExistingLink(
  prisma: PrismaService,
  linkData: LinkIssueInput,
) {
  const linkedIssue = await prisma.linkedIssue.findFirst({
    where: { url: linkData.url },
    include: { issue: { include: { team: true } } },
  });
  if (linkedIssue) {
    return {
      status: 400,
      message: `This ${linkData.type} has already been linked to an issue ${linkedIssue.issue.team.identifier}-${linkedIssue.issue.number}`,
    };
  }
  return { status: 200, message: null };
}

export function getSubscriberIds(
  userId: string,
  assigneeId: string,
  subscriberIds: string[] = [],
  type: SubscribeType,
): string[] {
  const subscribers = new Set(subscriberIds);

  switch (type) {
    case SubscribeType.UNSUBSCRIBE:
      subscribers.delete(userId);
      break;
    case SubscribeType.SUBSCRIBE:
      userId && subscribers.add(userId);
      assigneeId && subscribers.add(assigneeId);
      break;
    default:
      return undefined;
  }

  return Array.from(subscribers);
}
