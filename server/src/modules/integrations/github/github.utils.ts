/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  IntegrationAccount,
  IntegrationName,
  Issue,
  LinkedIssues,
  WorkflowCategory,
} from '@prisma/client';
import path from 'path';
import axios from 'axios';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import { PrismaService } from 'nestjs-prisma';

import {
  GithubRepositoryMappings,
  GithubSettings,
  IntegrationAccountWithRelations,
  Settings,
} from 'modules/integration_account/integration_account.interface';
import {
  CreateIssueInput,
  IssueRequestParams,
  IssueWithRelations,
  LinkIssueData,
  TeamRequestParams,
  UpdateIssueInput,
} from 'modules/issues/issues.interface';
import IssuesService from 'modules/issues/issues.service';
import { WebhookEventBody } from 'modules/webhooks/webhooks.interface';

import { PostRequestBody, labelDataType } from './github.interface';
import { Specification } from 'modules/integration_definition/integration_definition.interface';

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
): Promise<LinkedIssues> {
  const linkedIssue = await prisma.linkedIssues.findFirst({
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

  return integrationAccount.integratedById || null;
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
    title: `#${eventBody.issue.number} ${eventBody.issue.title}`,
    url: eventBody.issue.url,
    sourceId: eventBody.issue.id.toString(),
    source: { type: IntegrationName.Github },
    sourceData: { id: eventBody.issue.id, title: eventBody.issue.title },
  } as LinkIssueData;

  const issueInput = {
    title: eventBody.issue.title,
    description: eventBody.issue.body,
    stateId: stateId,
    ...(issueLabelIds && { labelIds: issueLabelIds }),
  } as CreateIssueInput;

  const sourceMetadata = {
    id: integrationAccount.id,
    type: IntegrationName.Github,
    userDisplayName: eventBody.sender.login,
  };

  return { linkIssueData, issueInput, sourceMetadata, userId };
}

async function getOrCreateLabelIds(
  prisma: PrismaService,
  labels: labelDataType[],
  teamId: string,
  workspaceId: string,
): Promise<string[]> {
  return await Promise.all(
    labels.map(async (labelData: labelDataType) => {
      // Try to find an existing label with the same name and color
      let label = await prisma.label.findFirst({
        where: { name: labelData.name, color: `#${labelData.color}` },
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
  const linkedIssue = await prisma.linkedIssues.update({
    where: { id: (await getLinkedIssue(prisma, issueSourceId)).id },
    data: {
      source: {
        type: IntegrationName.Github,
        syncedCommentId: issueComment.id,
      },
    },
  });
  const githubCommentBody = `<p><a href="${process.env.PUBLIC_FRONTEND_HOST}/${workspace.slug}/issue/${team.identifier}-${issue.number}">${team.identifier}-${issue.number} ${issue.title}</a></p>`;

  await sendGithubComment(linkedIssue, accessToken, githubCommentBody);
}

export async function handleIssues(
  prisma: PrismaService,
  issuesService: IssuesService,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccountWithRelations,
) {
  const accountSettings = integrationAccount.settings as Settings;
  console.log(accountSettings);

  const teamId = getTeamId(eventBody.repository.id.toString(), accountSettings);
  console.log(teamId);

  if (teamId) {
    switch (eventBody.action) {
      case 'opened': {
        const createIssueData = await getIssueData(
          prisma,
          eventBody,
          integrationAccount,
          teamId,
        );
        const issue = await issuesService.createIssue(
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
          null,
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
  const { issueId, source: linkedIssueSource } = await getLinkedIssue(
    prisma,
    eventBody.issue.id,
  );
  const parentId = (linkedIssueSource as Record<string, string>)
    .syncedCommentId;

  switch (eventBody.action) {
    case 'created':
      return await prisma.issueComment.create({
        data: {
          body: eventBody.comment.body,
          issueId,
          userId: await getUserId(prisma, eventBody.sender),
          parentId,
          sourceMetadata: {
            id: integrationAccount.id,
            type: IntegrationName.Github,
            userDisplayName: eventBody.sender.login,
          },
          linkedComment: {
            create: {
              url: eventBody.comment.url,
              sourceId: eventBody.comment.id.toString(),
              source: { type: IntegrationName.Github },
              sourceData: {
                id: eventBody.comment.id,
                body: eventBody.comment.body,
                displayUserName: eventBody.comment.user.login,
              },
            },
          },
        },
      });

    case 'edited':
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
                  },
                },
              },
            },
          },
        });
      }
      return undefined;
  }

  return { eventBody, integrationAccount };
}

async function getReponse(url: string, token: string) {
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  return response.data;
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
    return response.data;
  } catch (error) {
    console.error(`Error making POST request to ${url}: ${error.message}`);
    throw error;
  }
}

export async function getGithubSettings(installationId: string, token: string) {
  const orgUrl = `https://api.github.com/user/orgs`;
  const orgs = await getReponse(orgUrl, token);
  if (orgs.length !== 0) {
    const repoUrl = `https://api.github.com/user/installations/${installationId}/repositories`;
    const repos = await getReponse(repoUrl, token);
    return {
      orgAvatarURL: orgs[0].avatar_url,
      orgLogin: orgs[0].login,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      repositories: repos.repositories.map((repo: any) => {
        return { id: repo.id, fullName: repo.full_name };
      }),
    } as GithubSettings;
  }

  return {};
}

export async function getAccessToken(
  prisma: PrismaService,
  integrationAccount: IntegrationAccount,
) {
  let config = integrationAccount.integrationConfiguration as Record<
    string,
    string
  >;
  const currentDate = new Date();
  if (
    !config.access_expires_in ||
    currentDate >= new Date(config.access_expires_in)
  ) {
    const url = `https://github.com/login/oauth/access_token?client_id=${config.client_id}&client_secret=${config.client_secret}&refresh_token=${config.refresh_token}&grant_type=refresh_token`;
    const response = await axios.post(url, {});
    const tokens = new URLSearchParams(response.data);

    config.refresh_token = tokens.get('refresh_token');
    config.access_token = tokens.get('access_token');

    config.access_expires_in = new Date(
      currentDate.getTime() + Number(tokens.get('expires_in')) * 1000,
    )
      .getTime()
      .toString();

    config.refresh_expires_in = new Date(
      currentDate.getTime() +
        Number(tokens.get('refresh_token_expires_in')) * 1000,
    )
      .getTime()
      .toString();

    await prisma.integrationAccount.update({
      where: { id: integrationAccount.id },
      data: { integrationConfiguration: config },
    });
  }
  return config.access_token;
}

export async function sendGithubComment(
  linkedIssue: LinkedIssues,
  accessToken: string,
  body: string,
) {
  const url = `${linkedIssue.url}/comments`;
  console.log(url);
  const response = await postRequest(url, accessToken, { body });
  return response;
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
    const spec = integrationAccount.integrationDefinition
      .spec as unknown as Specification;
    const appId = spec.other_data.app_id;
    const privateKeyPath = path.join(
      __dirname,
      '../../../../certs/' + appId + '.pem',
    );
    const privateKey = await fs.readFile(privateKeyPath, 'utf8');

    const payload = {
      // issued at time, 60 seconds in the past to allow for clock drift
      iat: Math.floor(Date.now() / 1000) - 60,
      // JWT expiration time (10 minute maximum)
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
      // GitHub App's identifier
      iss: appId,
    };

    const token = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
    });

    const url = `https://api.github.com/app/installations/${integrationAccount.accountId}/access_tokens`;

    const accessResponse = await postRequest(url, token, {});
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
  const usersOnWorkspaces = await prisma.usersOnWorkspaces.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });

  const accountMapping = usersOnWorkspaces.externalAccountMappings as Record<
    string,
    string
  >;

  if (accountMapping) {
    return await prisma.integrationAccount.findFirst({
      where: { accountId: accountMapping[IntegrationName.Github] },
    });
  }
  return null;
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
  return await getReponse('https://api.github.com/user', token);
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

  const linkedIssue = await prisma.linkedIssues.findFirst({
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

    return await postRequest(linkedIssue.url, accessToken, issueBody);
  } else {
    const accessToken = await getBotAccessToken(prisma, integrationAccount);

    const defaultRepo = IntegrationSettings[
      IntegrationName.Github
    ].repositoryMappings.find((repo: GithubRepositoryMappings) => repo.default);

    if (defaultRepo) {
      const url = `https://api.github.com/repos/${defaultRepo.githubRepoFullName}/issues`;
      return await postRequest(url, accessToken, issueBody);
    }
  }

  return undefined;
}
