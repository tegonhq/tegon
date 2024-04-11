/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Logger } from '@nestjs/common';
import { IntegrationName, Issue, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { IntegrationAccountWithRelations } from 'modules/integration-account/integration-account.interface';
import {
  getBotAccessToken,
  getGithubHeaders,
  sendGithubFirstComment,
} from 'modules/integrations/github/github.utils';
import { getRequest } from 'modules/integrations/integrations.utils';

import {
  CreateLinkIssueInput,
  LinkIssueInput,
  LinkedIssueSubType,
  githubIssueRegex,
  githubPRRegex,
  slackRegex,
} from './linked-issue.interface';
import LinkedIssueService from './linked-issue.service';

export function isValidLinkUrl(linkData: LinkIssueInput): boolean {
  const { url, type } = linkData;
  if (type === LinkedIssueSubType.GithubIssue) {
    return githubIssueRegex.test(url);
  } else if (type === LinkedIssueSubType.GithubPullRequest) {
    return githubPRRegex.test(url);
  } else if (type === LinkedIssueSubType.Slack) {
    return slackRegex.test(url);
  } else if (type === LinkedIssueSubType.ExternalLink) {
    return true;
  }

  return false;
}

export function getLinkType(url: string): LinkedIssueSubType {
  if (githubIssueRegex.test(url)) {
    return LinkedIssueSubType.GithubIssue;
  } else if (githubPRRegex.test(url)) {
    return LinkedIssueSubType.GithubPullRequest;
  } else if (slackRegex.test(url)) {
    return LinkedIssueSubType.Slack;
  }
  return LinkedIssueSubType.ExternalLink;
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

export async function getLinkedIssueDataWithUrl(
  prisma: PrismaService,
  linkData: LinkIssueInput,
  teamId: string,
  issueId: string,
  userId: string,
): Promise<{
  integrationAccount: IntegrationAccountWithRelations | null;
  linkInput: CreateLinkIssueInput;
}> {
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
    return {
      integrationAccount,
      linkInput: { url: linkData.url, issueId, createdById: userId },
    };
  }

  const accessToken = await getBotAccessToken(prisma, integrationAccount);
  const response =
    (await getRequest(convertToAPIUrl(linkData), getGithubHeaders(accessToken)))
      .data ?? {};

  if (!response) {
    return {
      integrationAccount,
      linkInput: {
        url: linkData.url,
        issueId,
        createdById: userId,
        sourceData: linkData,
      },
    };
  }
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

  return {
    integrationAccount,
    linkInput: {
      url: response.html_url,
      issueId,
      sourceId: response.id.toString(),
      source,
      sourceData,
      createdById: userId,
    } as CreateLinkIssueInput,
  };
}

export async function sendFirstComment(
  prisma: PrismaService,
  logger: Logger,
  linkedIssueService: LinkedIssueService,
  integrationAccount: IntegrationAccountWithRelations,
  issue: Issue,
  sourceId: string,
  type: LinkedIssueSubType,
) {
  if (type === LinkedIssueSubType.GithubIssue) {
    await sendGithubFirstComment(
      prisma,
      logger,
      linkedIssueService,
      integrationAccount,
      issue,
      sourceId,
    );
  }
}
