import { Logger } from '@nestjs/common';
import { IntegrationName, LinkedIssue, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { IntegrationAccountWithRelations } from 'modules/integration-account/integration-account.interface';
import {
  getBotAccessToken,
  getGithubHeaders,
  sendGithubFirstComment,
  sendGithubPRFirstComment,
} from 'modules/integrations/github/github.utils';
import { getRequest } from 'modules/integrations/integrations.utils';
import { getSentryIssue } from 'modules/integrations/sentry/sentry.utils';
import {
  getSlackMessage,
  sendSlackLinkedMessage,
} from 'modules/integrations/slack/slack.utils';

import {
  CreateLinkIssueInput,
  LinkIssueInput,
  LinkedIssueSource,
  LinkedIssueSubType,
  LinkedIssueWithRelations,
  LinkedSlackMessageType,
  githubIssueRegex,
  githubPRRegex,
  sentryRegex,
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
  } else if (type === LinkedIssueSubType.Sentry) {
    return true;
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
  _teamId: string,
  issueId: string,
  userId: string,
): Promise<{
  integrationAccount: IntegrationAccountWithRelations | null;
  linkInput: CreateLinkIssueInput;
  linkDataType: LinkedIssueSubType;
}> {
  let integrationAccount: IntegrationAccountWithRelations;
  switch (linkData.type) {
    case LinkedIssueSubType.GithubIssue:
    case LinkedIssueSubType.GithubPullRequest:
      const isGithubPR = linkData.type === LinkedIssueSubType.GithubPullRequest;

      const githubUrlMatch = linkData.url.match(
        isGithubPR ? githubPRRegex : githubIssueRegex,
      );
      const [, repository] = githubUrlMatch;

      integrationAccount = await prisma.integrationAccount.findFirst({
        where: {
          settings: {
            path: [IntegrationName.Github, 'repositories'],
            array_contains: [{ fullName: repository }],
          } as Prisma.JsonFilter,
          isActive: true,
        },
        include: {
          integrationDefinition: true,
          workspace: true,
        },
      });

      if (!integrationAccount) {
        return {
          integrationAccount,
          linkInput: {
            url: linkData.url,
            issueId,
            createdById: userId,
            source: { type: LinkedIssueSubType.ExternalLink },
            sourceData: { title: `Github ${isGithubPR ? 'PR' : 'Issue'}` },
          },
          linkDataType: LinkedIssueSubType.ExternalLink,
        };
      }

      const accessToken = await getBotAccessToken(prisma, integrationAccount);
      const response =
        (
          await getRequest(
            convertToAPIUrl(linkData),
            getGithubHeaders(accessToken),
          )
        ).data ?? {};

      if (!response) {
        return {
          integrationAccount,
          linkInput: {
            url: linkData.url,
            issueId,
            createdById: userId,
            source: { type: LinkedIssueSubType.ExternalLink },
            sourceData: { title: linkData.title },
          },
          linkDataType: linkData.type,
        };
      }

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
        linkDataType: linkData.type,
      };

    case LinkedIssueSubType.Slack:
      const match = linkData.url.match(slackRegex);

      if (match) {
        const [
          ,
          slackTeamDomain,
          channelId,
          messageTimestamp,
          messageTimestampMicro,
          threadTs,
        ] = match;
        const parentTs = `${messageTimestamp}.${messageTimestampMicro}`;
        const messageTs = threadTs ? threadTs.replace('p', '') : parentTs;

        integrationAccount = await prisma.integrationAccount.findFirst({
          where: {
            settings: {
              path: [IntegrationName.Slack, 'channelMappings'],
              array_contains: [{ channelId }],
            } as Prisma.JsonFilter,
          },
          include: {
            integrationDefinition: true,
            workspace: true,
          },
        });

        const subType = integrationAccount
          ? LinkedSlackMessageType.Thread
          : LinkedSlackMessageType.Message;

        let message: string;
        if (integrationAccount) {
          const slackMessageResponse = await getSlackMessage(
            integrationAccount,
            { channelId, threadTs },
          );
          message = slackMessageResponse.messages[0].text;
        }

        return {
          integrationAccount,
          linkInput: {
            url: linkData.url,
            sourceId: `${channelId}_${parentTs || messageTs}`,
            source: {
              type: IntegrationName.Slack,
              subType,
              syncedCommentId: null,
            },
            sourceData: {
              channelId,
              messageTs,
              parentTs,
              slackTeamDomain,
              message,
            },
            createdById: userId,
            issueId,
          },
          linkDataType: linkData.type,
        };
      }
      break;

    case LinkedIssueSubType.Sentry:
      const sentryMatch = linkData.url.match(sentryRegex);

      if (sentryMatch) {
        const [, orgSlug, sentryIssueId] = sentryMatch;

        integrationAccount = await prisma.integrationAccount.findFirst({
          where: {
            settings: {
              path: [IntegrationName.Sentry, 'orgSlug'],
              equals: orgSlug,
            } as Prisma.JsonFilter,
          },
          include: {
            integrationDefinition: true,
            workspace: true,
          },
        });

        if (integrationAccount) {
          const sentryResponse = await getSentryIssue(
            prisma,
            integrationAccount,
            orgSlug,
            sentryIssueId,
          );

          if (sentryResponse.status !== 200) {
            break;
          }
          const sentryData = sentryResponse.data;
          return {
            integrationAccount,
            linkInput: {
              url: linkData.url,
              sourceId: sentryData.id,
              source: {
                type: IntegrationName.Sentry,
                syncedCommentId: null,
              },
              sourceData: {
                title: sentryData.title,
                projectId: sentryData.project.id,
                projectName: sentryData.project.name,
                type: sentryData.type,
                metadata: {
                  value: sentryData.metadata.value,
                  type: sentryData.metadata.type,
                  filename: sentryData.metadata.filename,
                },
                firstSeen: sentryData.firstSeen,
                issueType: sentryData.issueType,
                issueCategory: sentryData.issueCategory,
              },
              createdById: userId,
              issueId,
            },
            linkDataType: linkData.type,
          };
        }
      }
  }

  return {
    integrationAccount,
    linkInput: {
      url: linkData.url,
      issueId,
      createdById: userId,
      source: { type: LinkedIssueSubType.ExternalLink },
      sourceData: { title: linkData.title },
    },
    linkDataType: LinkedIssueSubType.ExternalLink,
  };
}

export async function sendFirstComment(
  prisma: PrismaService,
  logger: Logger,
  linkedIssueService: LinkedIssueService,
  integrationAccount: IntegrationAccountWithRelations,
  linkedIssue: LinkedIssueWithRelations,
  type: LinkedIssueSubType,
) {
  const subType = (linkedIssue.source as LinkedIssueSource)?.subType || null;
  if (type === LinkedIssueSubType.GithubIssue) {
    await sendGithubFirstComment(
      prisma,
      logger,
      linkedIssueService,
      integrationAccount,
      linkedIssue.issue,
      linkedIssue.sourceId,
    );
  } else if (type === LinkedIssueSubType.GithubPullRequest) {
    const matches = linkedIssue.url.match(
      /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)$/,
    );

    let url: string;
    if (matches) {
      const [, owner, repo, number] = matches;
      url = `https://api.github.com/repos/${owner}/${repo}/issues/${number}/comments`;
    }
    if (url) {
      await sendGithubPRFirstComment(
        prisma,
        integrationAccount,
        linkedIssue.issue.team,
        linkedIssue.issue,
        url,
      );
    }
  } else if (
    type === LinkedIssueSubType.Slack &&
    subType === LinkedSlackMessageType.Thread
  ) {
    await sendSlackLinkedMessage(
      prisma,
      logger,
      integrationAccount,
      linkedIssue,
    );
  }
}

export async function getLinkDetails(
  prisma: PrismaService,
  linkedIssue: LinkedIssue,
) {
  const linkedIssueSource = linkedIssue.source as LinkedIssueSource;
  let integrationAccount: IntegrationAccountWithRelations;
  switch (linkedIssueSource.type) {
    case IntegrationName.Sentry:
      const sentryMatch = linkedIssue.url.match(sentryRegex);
      const [, orgSlug, sentryIssueId] = sentryMatch;

      integrationAccount = await prisma.integrationAccount.findFirst({
        where: {
          settings: {
            path: [IntegrationName.Sentry, 'orgSlug'],
            equals: orgSlug,
          } as Prisma.JsonFilter,
        },
        include: {
          integrationDefinition: true,
          workspace: true,
        },
      });

      const sentryResponse = await getSentryIssue(
        prisma,
        integrationAccount,
        orgSlug,
        sentryIssueId,
      );
      if (sentryResponse.status !== 200) {
        return undefined;
      }
      const sentryData = sentryResponse.data;
      return {
        status: sentryData.status,
        events: sentryData.count,
        lastSeen: sentryData.lastSeen,
        seenByUser: sentryData.seenBy.length > 0 ? true : false,
        priority: sentryData.priority,
      };
      break;
  }

  return undefined;
}
