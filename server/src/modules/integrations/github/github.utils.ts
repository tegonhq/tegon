/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import fs from 'fs/promises';
import path from 'path';

import { Team } from '@@generated/team/entities';
import {
  IntegrationAccount,
  IntegrationName,
  Issue,
  LinkedIssue,
  Prisma,
  WorkflowCategory,
} from '@prisma/client';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { PrismaService } from 'nestjs-prisma';

import {
  GithubRepositoryMappings,
  GithubSettings,
  IntegrationAccountWithRelations,
  Settings,
} from 'modules/integration-account/integration-account.interface';
import { Specification } from 'modules/integration-definition/integration-definition.interface';
import {
  IssueCommentAction,
  IssueCommentWithRelations,
  LinkedCommentSourceData,
} from 'modules/issue-comments/issue-comments.interface';
import {
  CreateIssueInput,
  IssueRequestParams,
  IssueWithRelations,
  LinkIssueData,
  LinkedIssueSource,
  LinkedIssueSourceData,
  LinkedIssueSubType,
  TeamRequestParams,
  UpdateIssueInput,
} from 'modules/issues/issues.interface';
import IssuesService from 'modules/issues/issues.service';
import { WebhookEventBody } from 'modules/webhooks/webhooks.interface';

import { PostRequestBody, labelDataType } from './github.interface';

async function getState(
  prisma: PrismaService,
  action: string,
  teamId: string,
): Promise<string> {
  let workflow;
  switch (action) {
    case 'opened':
    case 'reopened':
      workflow = await prisma.workflow.findFirst({
        where: { teamId, category: 'TRIAGE' },
        orderBy: { position: 'asc' },
      });
      return workflow.id;
    case 'closed':
      workflow = await prisma.workflow.findFirst({
        where: { teamId, category: 'COMPLETED' },
        orderBy: { position: 'asc' },
      });
      return workflow.id;
    default:
      return undefined;
  }
}

function getTeamId(repoId: string, accountSettings: Settings) {
  const mapping = accountSettings[
    IntegrationName.Github
  ].repositoryMappings.find((mapping) => {
    return mapping.githubRepoId === repoId;
  });
  return mapping ? mapping.teamId : undefined;
}

async function getLinkedIssue(
  prisma: PrismaService,
  sourceIssueId: string,
): Promise<LinkedIssue> {
  const linkedIssue = await prisma.linkedIssue.findFirst({
    where: { sourceId: sourceIssueId.toString() },
    include: { issue: true },
  });
  return linkedIssue || null;
}

async function getUserId(
  prisma: PrismaService,
  userData: Record<string, string>,
) {
  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: { accountId: userData.id.toString() },
  });

  return integrationAccount?.integratedById || null;
}

async function getIssueData(
  prisma: PrismaService,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccount,
  teamId: string,
) {
  const stateId = await getState(prisma, eventBody.action, teamId);
  const userId = await getUserId(prisma, eventBody.sender);

  const issueLabelIds = await getOrCreateLabelIds(
    prisma,
    eventBody.issue.labels,
    teamId,
    integrationAccount.workspaceId,
  );

  const linkIssueData = {
    url: eventBody.issue.html_url,
    sourceId: eventBody.issue.id.toString(),
    source: {
      type: IntegrationName.Github,
      subType: LinkedIssueSubType.GithubIssue,
    },
    sourceData: {
      id: eventBody.issue.id,
      title: eventBody.issue.title,
      apiUrl: eventBody.issue.url,
    },
    createdById: userId,
  } as LinkIssueData;

  const issueInput = {
    title: eventBody.issue.title,
    description: eventBody.issue.body,
    stateId,
    isBidirectional: true,
    ...(issueLabelIds && { labelIds: issueLabelIds }),
  } as CreateIssueInput;

  const sourceMetadata = {
    id: integrationAccount.id,
    type: IntegrationName.Github,
    userDisplayName: eventBody.sender.login,
  };

  return { linkIssueData, issueInput, sourceMetadata, userId };
}

export async function getOrCreateLabelIds(
  prisma: PrismaService,
  labels: labelDataType[],
  teamId: string,
  workspaceId: string,
): Promise<string[]> {
  return await Promise.all(
    labels.map(async (labelData: labelDataType) => {
      // Try to find an existing label with the same name (case-insensitive) and color
      let label = await prisma.label.findFirst({
        where: {
          name: { equals: labelData.name, mode: 'insensitive' },
        },
      });

      // If no matching label was found, create a new one
      if (!label) {
        label = await prisma.label.create({
          data: {
            name: labelData.name,
            color: `#${labelData.color}`,
            teamId,
            workspaceId,
          },
        });
      }

      // Return the ID of the found or created label
      return label.id;
    }),
  );
}

async function getTeam(prisma: PrismaService, teamId: string) {
  return await prisma.team.findUnique({ where: { id: teamId } });
}

export async function sendGithubFirstComment(
  prisma: PrismaService,
  integrationAccount: IntegrationAccountWithRelations,
  issue: Issue,
  issueSourceId: string,
) {
  const workspace = integrationAccount.workspace;
  const accessToken = await getBotAccessToken(prisma, integrationAccount);

  const team = await getTeam(prisma, issue.teamId);
  const commentBody = `${IntegrationName.Github} thread in ${issue.title}`;
  const issueComment = await prisma.issueComment.create({
    data: {
      body: commentBody,
      issueId: issue.id,
      sourceMetadata: issue.sourceMetadata,
    },
  });
  const linkedIssue = await prisma.linkedIssue.update({
    where: { id: (await getLinkedIssue(prisma, issueSourceId)).id },
    data: {
      source: {
        type: IntegrationName.Github,
        subType: LinkedIssueSubType.GithubIssue,
        syncedCommentId: issueComment.id,
      },
    },
  });
  const githubCommentBody = `<p><a href="${process.env.PUBLIC_FRONTEND_HOST}/${workspace.slug}/issue/${team.identifier}-${issue.number}">${team.identifier}-${issue.number} ${issue.title}</a></p>`;

  await sendGithubComment(linkedIssue, accessToken, githubCommentBody);
}

export async function sendGithubPRFirstComment(
  prisma: PrismaService,
  integrationAccount: IntegrationAccountWithRelations,
  team: Team,
  issue: Issue,
  url: string,
) {
  const githubCommentBody = `<p><a href="${process.env.PUBLIC_FRONTEND_HOST}/${integrationAccount.workspace.slug}/issue/${team.identifier}-${issue.number}">${team.identifier}-${issue.number} ${issue.title}</a></p>`;
  const accessToken = await getBotAccessToken(prisma, integrationAccount);

  await postRequest(url, accessToken, {
    body: githubCommentBody,
  });
}

export async function sendGithubComment(
  linkedIssue: LinkedIssue,
  accessToken: string,
  body: string,
) {
  const linkedIssueSource = linkedIssue.sourceData as LinkedIssueSourceData;
  const url = `${linkedIssueSource.apiUrl}/comments`;
  const response = await postRequest(url, accessToken, { body });
  return response;
}

export async function handleIssues(
  prisma: PrismaService,
  issuesService: IssuesService,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccountWithRelations,
) {
  const accountSettings = integrationAccount.settings as Settings;

  const teamId = getTeamId(eventBody.repository.id.toString(), accountSettings);

  if (teamId) {
    switch (eventBody.action) {
      case 'opened': {
        const createIssueData = await getIssueData(
          prisma,
          eventBody,
          integrationAccount,
          teamId,
        );
        const issue = await issuesService.createIssueAPI(
          { teamId } as TeamRequestParams,
          createIssueData.issueInput,
          createIssueData.userId,
          createIssueData.linkIssueData,
          createIssueData.sourceMetadata,
        );

        await sendGithubFirstComment(
          prisma,
          integrationAccount,
          issue,
          eventBody.issue.id,
        );
        return issue;
      }

      case 'edited':
      case 'reopened':
      case 'closed': {
        const linkedIssue = await getLinkedIssue(prisma, eventBody.issue.id);
        if (!linkedIssue?.issueId) {
          break;
        }
        const updateIssueData = await getIssueData(
          prisma,
          eventBody,
          integrationAccount,
          teamId,
        );
        return await issuesService.updateIssue(
          { teamId } as TeamRequestParams,
          updateIssueData.issueInput as UpdateIssueInput,
          { issueId: linkedIssue.issueId } as IssueRequestParams,
          updateIssueData.userId,
          updateIssueData.linkIssueData,
          updateIssueData.sourceMetadata,
        );
      }

      case 'labeled':
      case 'unlabeled': {
        const linkedIssue = await getLinkedIssue(prisma, eventBody.issue.id);
        if (!linkedIssue?.issueId) {
          break;
        }
        const issueLabelIds = await getOrCreateLabelIds(
          prisma,
          eventBody.issue.labels,
          teamId,
          integrationAccount.workspaceId,
        );

        const userId = await getUserId(prisma, eventBody.sender);
        return await issuesService.updateIssue(
          { teamId } as TeamRequestParams,
          { labelIds: issueLabelIds } as UpdateIssueInput,
          { issueId: linkedIssue.issueId } as IssueRequestParams,
          userId,
        );
      }

      case 'assigned':
      case 'unassigned': {
        const linkedIssue = await getLinkedIssue(prisma, eventBody.issue.id);
        if (!linkedIssue?.issueId) {
          break;
        }

        let assigneeId = null;
        if (eventBody.action === 'assigned') {
          assigneeId = await getUserId(prisma, eventBody.assignee);
          if (!assigneeId) {
            break;
          }
        }

        const updateIssueData = await getIssueData(
          prisma,
          eventBody,
          integrationAccount,
          teamId,
        );
        return await issuesService.updateIssue(
          { teamId } as TeamRequestParams,
          { assigneeId } as UpdateIssueInput,
          { issueId: linkedIssue.issueId } as IssueRequestParams,
          updateIssueData.userId,
          null,
          updateIssueData.sourceMetadata,
        );
      }

      default:
        break;
    }
  }

  return {};
}

export async function handleIssueComments(
  prisma: PrismaService,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccountWithRelations,
) {
  const linkedIssue = await getLinkedIssue(prisma, eventBody.issue.id);
  if (!linkedIssue) {
    console.warn(
      `No linked issue found for GitHub issue ID: ${eventBody.issue.id}`,
    );
    return undefined;
  }

  const { issueId, source: linkedIssueSource } = linkedIssue;
  const parentId = (linkedIssueSource as Record<string, string>)
    .syncedCommentId;
  const userId = await getUserId(prisma, eventBody.sender);

  switch (eventBody.action) {
    case 'created':
      const linkedComment = await prisma.linkedComment.findFirst({
        where: { sourceId: eventBody.comment.id.toString() },
        include: { comment: true },
      });
      if (linkedComment) {
        return linkedComment.comment;
      }
      return await prisma.issueComment.create({
        data: {
          body: eventBody.comment.body,
          issueId,
          userId,
          parentId,
          sourceMetadata: {
            id: integrationAccount.id,
            type: IntegrationName.Github,
            userDisplayName: eventBody.sender.login,
          },
          linkedComment: {
            create: {
              url: eventBody.comment.html_url,
              sourceId: eventBody.comment.id.toString(),
              source: { type: IntegrationName.Github },
              sourceData: {
                id: eventBody.comment.id,
                body: eventBody.comment.body,
                displayUserName: eventBody.comment.user.login,
                apiUrl: eventBody.comment.url,
              },
              createdById: userId,
            },
          },
        },
      });

    case 'edited': {
      const linkedComment = await prisma.linkedComment.findFirst({
        where: { sourceId: eventBody.comment.id.toString() },
      });
      if (linkedComment) {
        return await prisma.issueComment.update({
          where: { id: linkedComment.commentId },
          data: {
            body: eventBody.comment.body,
            linkedComment: {
              update: {
                where: { id: linkedComment.id },
                data: {
                  sourceData: {
                    id: eventBody.comment.id,
                    body: eventBody.comment.body,
                    displayUserName: eventBody.comment.user.login,
                    apiUrl: eventBody.comment.url,
                  },
                  createdById: userId,
                },
              },
            },
          },
        });
      }
      return undefined;
    }

    case 'deleted': {
      const linkedComment = await prisma.linkedComment.findFirst({
        where: { sourceId: eventBody.comment.id.toString() },
      });
      if (linkedComment) {
        return await prisma.issueComment.update({
          where: { id: linkedComment.commentId },
          data: {
            deleted: new Date().toISOString(),
            linkedComment: {
              update: {
                where: { id: linkedComment.id },
                data: {
                  deleted: new Date().toISOString(),
                },
              },
            },
          },
        });
      }
      return undefined;
    }

    default:
      return undefined;
  }
}

export async function handlePullRequests(
  prisma: PrismaService,
  issuesService: IssuesService,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccountWithRelations,
) {
  const branchName = eventBody.pull_request.head.ref;
  const branchNameRegex = /^([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)-(\d+)$/;
  const match = branchName.match(branchNameRegex);
  const [, userName, teamSlug, issueNumber] = match ?? [];

  const user = await prisma.user.findFirst({
    where: { username: { equals: userName, mode: 'insensitive' } },
  });
  const team = (await prisma.team.findFirst({
    where: { identifier: { equals: teamSlug, mode: 'insensitive' } },
  })) as Team;
  const issue = await prisma.issue.findFirst({
    where: { number: Number(issueNumber), teamId: team.id },
  });

  if (!user || !team || !issue) {
    return undefined;
  }

  const pullRequestId = eventBody.pull_request.id.toString();
  const sourceData = {
    branch: eventBody.pull_request.head.ref,
    id: pullRequestId,
    closedAt: eventBody.pull_request.closed_at,
    createdAt: eventBody.pull_request.created_at,
    updatedAt: eventBody.pull_request.updated_at,
    number: eventBody.pull_request.number,
    state: eventBody.pull_request.state,
    title: eventBody.pull_request.title,
    apiUrl: eventBody.pull_request.url,
    mergedAt: eventBody.pull_request.merged_at,
  };

  switch (eventBody.action) {
    case 'opened': {
      const linkedIssue = await prisma.linkedIssue.create({
        data: {
          url: eventBody.pull_request.html_url,
          sourceId: pullRequestId,
          issueId: issue.id,
          source: {
            type: IntegrationName.Github,
            subType: LinkedIssueSubType.GithubPullRequest,
            pullRequestId,
          },
          sourceData,
          createdById: user.id,
        },
      });

      await sendGithubPRFirstComment(
        prisma,
        integrationAccount,
        team,
        issue,
        eventBody.pull_request.comments_url,
      );
      // const githubCommentBody = `<p><a href="${process.env.PUBLIC_FRONTEND_HOST}/${workspace.slug}/issue/${team.identifier}-${issue.number}">${team.identifier}-${issue.number} ${issue.title}</a></p>`;
      // const accessToken = await getBotAccessToken(prisma, integrationAccount);

      // await postRequest(eventBody.pull_request.comments_url, accessToken, {
      //   body: githubCommentBody,
      // });

      return linkedIssue;
    }

    case 'closed': {
      const linkedIssues = await prisma.linkedIssue.findMany({
        where: { issueId: issue.id },
      });

      const openPRs = linkedIssues.filter(
        (linkedIssue) =>
          (linkedIssue.source as LinkedIssueSource).subType ===
            LinkedIssueSubType.GithubPullRequest &&
          (linkedIssue.sourceData as LinkedIssueSourceData).state === 'open',
      );

      const linkedIssueIds = openPRs.reduce(
        (map, linkedIssue) => {
          map[linkedIssue.sourceId] = linkedIssue.id;
          return map;
        },
        {} as Record<string, string>,
      );

      if (pullRequestId in linkedIssueIds) {
        const linkedIssue = await prisma.linkedIssue.update({
          where: { id: linkedIssueIds[pullRequestId] },
          data: { sourceData },
        });

        if (openPRs.length <= 1 && sourceData.mergedAt) {
          const stateId = await getState(prisma, 'closed', team.id);
          await issuesService.updateIssue(
            { teamId: team.id } as TeamRequestParams,
            { stateId } as UpdateIssueInput,
            { issueId: linkedIssue.issueId } as IssueRequestParams,
            user.id,
            null,
            {
              id: integrationAccount.id,
              type: IntegrationName.Github,
              userDisplayName: eventBody.sender.login,
            },
          );
        }

        return linkedIssue;
      }

      return undefined;
    }

    default:
      return undefined;
  }
}

export async function handleRepositories(
  prisma: PrismaService,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccountWithRelations,
) {
  const integrationAccountSettings = integrationAccount.settings as Settings;
  const repositories =
    eventBody.action === 'added'
      ? eventBody.repositories_added
      : eventBody.repositories_removed;

  const currentRepositories = integrationAccountSettings.Github.repositories;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const repoArray = repositories.map((repo: any) => ({
    id: repo.id.toString(),
    fullName: repo.full_name,
    name: repo.name,
    private: repo.private,
  }));

  // Merge repositories and currentRepositories, removing duplicates
  const mergedRepositories =
    eventBody.action === 'added'
      ? [...new Set([...repoArray, ...currentRepositories])]
      : currentRepositories.filter(
          (repo) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            !repoArray.some((r: any) => r.id.toString() === repo.id.toString()),
        );

  integrationAccountSettings.Github.repositories = mergedRepositories;

  // Update the integrationAccount settings with the merged repositories
  return await prisma.integrationAccount.update({
    where: { id: integrationAccount.id },
    data: {
      settings: integrationAccountSettings as Prisma.JsonObject,
    },
  });
}

export async function handleInstallations(
  prisma: PrismaService,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccountWithRelations,
) {
  if (eventBody.action !== 'installed') {
    const isActive = eventBody.action === 'unsuspend' ? true : false;
    const updateData: Prisma.IntegrationAccountUpdateInput = { isActive };

    if (eventBody.action === 'deleted') {
      updateData.deleted = new Date();
    }

    return await prisma.integrationAccount.update({
      where: { id: integrationAccount.id },
      data: updateData,
    });
  }
  return undefined;
}

export async function getReponse(url: string, token: string) {
  try {
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return {
      status: error.response.status,
      data: {},
      error: error.response.data,
    };
  }
}

async function postRequest(url: string, token: string, body: PostRequestBody) {
  try {
    const response = await axios.post(url, body, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error making POST request to ${url}: ${error.message}`);
    return {
      status: error.response.status,
      data: {},
      error: error.response.data,
    };
  }
}

export async function deleteRequest(url: string, token: string) {
  try {
    const response = await axios.delete(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error making DELETE request to ${url}: ${error.message}`);
    return {
      status: error.response.status,
      data: {},
      error: error.response.data,
    };
  }
}

export async function getGithubSettings(
  integrationAccount: IntegrationAccountWithRelations,
  token: string,
) {
  const installationId = integrationAccount.accountId;
  const orgUrl = `https://api.github.com/app/installations/${installationId}`;

  const org = (
    await getReponse(orgUrl, await getBotJWTToken(integrationAccount))
  ).data;
  if (org) {
    const repoUrl = `https://api.github.com/user/installations/${installationId}/repositories`;
    const repos = (await getReponse(repoUrl, token)).data;
    return {
      orgAvatarURL: org.account.avatar_url,
      orgLogin: org.account.login,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      repositories: repos?.repositories.map((repo: any) => {
        return {
          id: repo.id.toString(),
          fullName: repo.full_name,
          name: repo.name,
          private: repo.private,
        };
      }),
      repositoryMappings: [],
    } as GithubSettings;
  }

  return {} as GithubSettings;
}

export async function getAccessToken(
  prisma: PrismaService,
  integrationAccount: IntegrationAccount,
) {
  const config = integrationAccount.integrationConfiguration as Record<
    string,
    string
  >;
  const currentDate = new Date();
  if (
    !config.access_expires_in ||
    currentDate >= new Date(Number(config.access_expires_in))
  ) {
    const url = `https://github.com/login/oauth/access_token?client_id=${config.client_id}&client_secret=${config.client_secret}&refresh_token=${config.refresh_token}&grant_type=refresh_token`;
    const response = await axios.post(url, {});
    const tokens = new URLSearchParams(response.data);

    config.refresh_token = tokens.get('refresh_token');
    config.access_token = tokens.get('access_token');

    config.access_expires_in = (
      currentDate.getTime() +
      Number(tokens.get('expires_in')) * 1000
    ).toString();

    config.refresh_expires_in = (
      currentDate.getTime() +
      Number(tokens.get('refresh_token_expires_in')) * 1000
    ).toString();

    await prisma.integrationAccount.update({
      where: { id: integrationAccount.id },
      data: { integrationConfiguration: config },
    });
  }
  return config.access_token;
}

export async function getBotJWTToken(
  integrationAccount: IntegrationAccountWithRelations,
) {
  const spec = integrationAccount.integrationDefinition
    .spec as unknown as Specification;

  const appId = spec.other_data.app_id;
  const privateKeyPath = path.join(process.cwd(), `certs/${appId}.pem`);
  const privateKey = await fs.readFile(privateKeyPath, 'utf8');

  const payload = {
    // issued at time, 60 seconds in the past to allow for clock drift
    iat: Math.floor(Date.now() / 1000) - 60,
    // JWT expiration time (10 minute maximum)
    exp: Math.floor(Date.now() / 1000) + 10 * 60,
    // GitHub App's identifier
    iss: appId,
  };

  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
  });
}

export async function getBotAccessToken(
  prisma: PrismaService,
  integrationAccount: IntegrationAccountWithRelations,
) {
  let config = integrationAccount.integrationConfiguration as Record<
    string,
    string
  >;

  const currentTime = new Date().getTime();
  if (
    !config.expires_at ||
    currentTime > new Date(config.expires_at).getTime()
  ) {
    const token = await getBotJWTToken(integrationAccount);

    const url = `https://api.github.com/app/installations/${integrationAccount.accountId}/access_tokens`;

    const accessResponse = (await postRequest(url, token, {})).data;

    config = {
      access_token: accessResponse.token,
      expires_at: accessResponse.expires_at,
    };
    await prisma.integrationAccount.update({
      where: { id: integrationAccount.id },
      data: { integrationConfiguration: config },
    });
  }
  return config.access_token;
}

async function getGithubUserIntegrationAccount(
  prisma: PrismaService,
  userId: string,
  workspaceId: string,
) {
  return await prisma.integrationAccount.findFirst({
    where: {
      integratedById: userId,
      integrationDefinition: {
        workspaceId,
        name: IntegrationName.GithubPersonal,
      },
    },
  });
}

async function getGithubLabels(
  prisma: PrismaService,
  labelIds: string[],
): Promise<string[]> {
  const labels = Promise.all(
    labelIds.map(async (labelId: string) => {
      return (
        await prisma.label.findUnique({
          where: { id: labelId },
          select: { name: true },
        })
      ).name;
    }),
  );
  return labels;
}

export async function getGithubUser(token: string) {
  return (await getReponse('https://api.github.com/user', token)).data ?? {};
}

export async function upsertGithubIssue(
  prisma: PrismaService,
  issue: IssueWithRelations,
  integrationAccount: IntegrationAccountWithRelations,
  userId: string,
) {
  const IntegrationSettings = integrationAccount.settings as Settings;

  const stateCategory = (
    await prisma.workflow.findUnique({
      where: { id: issue.stateId },
      select: { category: true },
    })
  ).category as WorkflowCategory;

  const assigneeGithubUser = await getGithubUserIntegrationAccount(
    prisma,
    issue.assigneeId,
    issue.team.workspaceId,
  );

  const issueBody = {
    title: issue.title,
    body: issue.description,
    labels: await getGithubLabels(prisma, issue.labelIds),
    assignees: [(assigneeGithubUser.settings as Settings).GithubPersonal.login],
    state:
      stateCategory === WorkflowCategory.COMPLETED
        ? 'closed'
        : stateCategory === WorkflowCategory.CANCELED
          ? 'not_planned'
          : 'open',
  };

  const linkedIssue = await prisma.linkedIssue.findFirst({
    where: {
      issueId: issue.id,
      source: { path: ['type'], equals: IntegrationName.Github },
    },
  });

  if (linkedIssue) {
    const userGithubIntegrationAccount = await getGithubUserIntegrationAccount(
      prisma,
      userId,
      issue.team.workspaceId,
    );

    const accessToken = userGithubIntegrationAccount
      ? await getAccessToken(prisma, userGithubIntegrationAccount)
      : await getBotAccessToken(prisma, integrationAccount);

    return (
      await postRequest(
        (linkedIssue.sourceData as LinkedIssueSourceData).apiUrl,
        accessToken,
        issueBody,
      )
    ).data;
  }
  const accessToken = await getBotAccessToken(prisma, integrationAccount);

  const defaultRepo = IntegrationSettings[
    IntegrationName.Github
  ].repositoryMappings.find((repo: GithubRepositoryMappings) => repo.default);

  if (defaultRepo) {
    const url = `https://api.github.com/repos/${defaultRepo.githubRepoFullName}/issues`;
    return (await postRequest(url, accessToken, issueBody)).data;
  }

  return undefined;
}

export async function upsertGithubIssueComment(
  prisma: PrismaService,
  issueComment: IssueCommentWithRelations,
  integrationAccount: IntegrationAccountWithRelations,
  userId: string,
  action: IssueCommentAction,
) {
  const userGithubIntegrationAccount = await getGithubUserIntegrationAccount(
    prisma,
    userId,
    issueComment.issue.team.workspaceId,
  );

  const accessToken = userGithubIntegrationAccount
    ? await getAccessToken(prisma, userGithubIntegrationAccount)
    : await getBotAccessToken(prisma, integrationAccount);

  switch (action) {
    case IssueCommentAction.CREATED:
      const linkedIssue = await prisma.linkedIssue.findFirst({
        where: { issueId: issueComment.issueId },
      });

      if (linkedIssue) {
        const url = `${(linkedIssue.sourceData as LinkedIssueSourceData).apiUrl}/comments`;
        const githubIssueComment = (
          await postRequest(url, accessToken, {
            body: issueComment.body,
          })
        ).data;
        const sourceMetadata = {
          id: githubIssueComment.id,
          body: githubIssueComment.body,
          displayUserName: githubIssueComment.user.login,
          apiUrl: githubIssueComment.url,
        };
        await prisma.linkedComment.create({
          data: {
            sourceId: githubIssueComment.id.toString(),
            url: githubIssueComment.html_url,
            source: { type: IntegrationName.Github },
            sourceData: sourceMetadata,
            commentId: issueComment.id,
            createdById: userId,
          },
        });
        await prisma.issueComment.update({
          where: { id: issueComment.id },
          data: { sourceMetadata },
        });
        return githubIssueComment;
      }
      return undefined;

    case IssueCommentAction.UPDATED:
      const linkedComment = await prisma.linkedComment.findFirst({
        where: {
          commentId: issueComment.id,
          source: { path: ['type'], equals: IntegrationName.Github },
        },
      });
      if (linkedComment) {
        return await postRequest(
          (linkedComment.sourceData as LinkedCommentSourceData).apiUrl,
          accessToken,
          {
            body: issueComment.body,
          },
        );
      }
      return undefined;

    case IssueCommentAction.DELETED:
      const deletedLinkedComment = await prisma.linkedComment.findFirst({
        where: {
          commentId: issueComment.id,
          source: { path: ['type'], equals: IntegrationName.Github },
        },
      });
      if (deletedLinkedComment) {
        const deleteResponse = await deleteRequest(
          (deletedLinkedComment.sourceData as LinkedCommentSourceData).apiUrl,
          accessToken,
        );

        await prisma.linkedComment.update({
          where: { id: deletedLinkedComment.id },
          data: { deleted: new Date().toISOString() },
        });
        return deleteResponse;
      }
      return undefined;
  }
}
