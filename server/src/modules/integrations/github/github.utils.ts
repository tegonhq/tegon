/* eslint-disable dot-location */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import fs from 'fs/promises';
import path from 'path';

import { Team } from '@@generated/team/entities';
import { Logger } from '@nestjs/common';
import {
  IntegrationAccount,
  IntegrationName,
  Issue,
  LinkedIssue,
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
  IssueWithRelations,
  LinkedIssueSubType,
  UpdateIssueInput,
} from 'modules/issues/issues.interface';
import {
  LinkIssueData,
  LinkedIssueSourceData,
} from 'modules/linked-issue/linked-issue.interface';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';
import { WebhookEventBody } from 'modules/webhooks/webhooks.interface';

import {
  githubHeaders,
  githubIssueData,
  labelDataType,
} from './github.interface';
import { deleteRequest, getRequest, postRequest } from '../integrations.utils';

export async function getState(
  prisma: PrismaService,
  action: string,
  teamId: string,
): Promise<string> {
  const category =
    action === 'opened' || action === 'reopened'
      ? 'TRIAGE'
      : action === 'closed'
        ? 'COMPLETED'
        : null;

  if (category) {
    const workflow = await prisma.workflow.findFirst({
      where: { teamId, category },
      orderBy: { position: 'asc' },
    });
    return workflow?.id;
  }

  return undefined;
}

export function getTeamId(
  repoId: string,
  accountSettings: Settings,
): string | undefined {
  const githubSettings = accountSettings[IntegrationName.Github];
  const mapping = githubSettings.repositoryMappings.find(
    (mapping) => mapping.githubRepoId === repoId,
  );
  return mapping?.teamId;
}

export async function getUserId(
  prisma: PrismaService,
  userData: Record<string, string>,
) {
  const integrationAccount = await prisma.integrationAccount.findFirst({
    where: { accountId: userData.id.toString() },
    select: { integratedById: true },
  });

  return integrationAccount?.integratedById || null;
}

export async function getIssueData(
  prisma: PrismaService,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccount,
  teamId: string,
): Promise<githubIssueData> {
  const [stateId, userId, issueLabelIds] = await Promise.all([
    getState(prisma, eventBody.action, teamId),
    getUserId(prisma, eventBody.sender),
    getOrCreateLabelIds(
      prisma,
      eventBody.issue.labels,
      teamId,
      integrationAccount.workspaceId,
    ),
  ]);

  const linkIssueData: LinkIssueData = {
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
  };

  const issueInput: UpdateIssueInput = {
    title: eventBody.issue.title,
    description: eventBody.issue.body,
    stateId,
    isBidirectional: true,
    ...(issueLabelIds && { labelIds: issueLabelIds }),
  } as UpdateIssueInput;

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
  // Extract label names from the input
  const labelNames = labels.map((label) => label.name);

  // Find existing labels with matching names (case-insensitive)
  const existingLabels = await prisma.label.findMany({
    where: {
      name: { in: labelNames, mode: 'insensitive' },
    },
  });

  // Create a map of existing label names to their IDs
  const existingLabelMap = new Map(
    existingLabels.map((label) => [label.name.toLowerCase(), label.id]),
  );

  // Create new labels for names that don't have a match
  const newLabels = await Promise.all(
    labels
      .filter((label) => !existingLabelMap.has(label.name.toLowerCase()))
      .map((label) =>
        prisma.label.create({
          data: {
            name: label.name,
            color: `#${label.color}`,
            teamId,
            workspaceId,
          },
        }),
      ),
  );

  // Combine the IDs of existing and new labels
  return [
    ...existingLabels.map((label) => label.id),
    ...newLabels.map((label) => label.id),
  ];
}

export async function sendGithubFirstComment(
  prisma: PrismaService,
  logger: Logger,
  linkedIssueService: LinkedIssueService,
  integrationAccount: IntegrationAccountWithRelations,
  issue: Issue,
  issueSourceId: string,
) {
  const { workspace } = integrationAccount;
  const { id: issueId, teamId, number, title, sourceMetadata } = issue;

  logger.log(`Sending first comment for issue ${issueId} to GitHub`);

  const [accessToken, team, linkedIssue] = await Promise.all([
    getBotAccessToken(prisma, integrationAccount),
    prisma.team.findUnique({ where: { id: teamId } }),
    linkedIssueService.getLinkedIssueBySourceId(issueSourceId),
  ]);

  logger.debug(
    `Access token, team, and linked issue retrieved for issue ${issueId}`,
  );

  const commentBody = `${IntegrationName.Github} thread in ${title}`;
  const issueComment = await prisma.issueComment.create({
    data: {
      body: commentBody,
      issueId,
      sourceMetadata,
    },
  });

  logger.debug(`Issue comment created for issue ${issueId}`);

  await linkedIssueService.updateLinkIssueApi(
    { linkedIssueId: linkedIssue.id },
    {
      source: {
        type: IntegrationName.Github,
        subType: LinkedIssueSubType.GithubIssue,
        syncedCommentId: issueComment.id,
      },
    },
  );

  logger.debug(`Linked issue updated for issue ${issueId}`);

  const githubCommentBody = `<p><a href="${process.env.PUBLIC_FRONTEND_HOST}/${workspace.slug}/issue/${team.identifier}-${number}">${team.identifier}-${number} ${title}</a></p>`;

  await sendGithubComment(linkedIssue, accessToken, githubCommentBody);

  logger.log(`GitHub comment sent for issue ${issueId}`);
}

export async function sendGithubPRFirstComment(
  prisma: PrismaService,
  integrationAccount: IntegrationAccountWithRelations,
  team: Team,
  issue: Issue,
  url: string,
) {
  const { workspace } = integrationAccount;
  const { number, title } = issue;

  const [accessToken, githubCommentBody] = await Promise.all([
    getBotAccessToken(prisma, integrationAccount),
    `<p><a href="${process.env.PUBLIC_FRONTEND_HOST}/${workspace.slug}/issue/${team.identifier}-${number}">${team.identifier}-${number} ${title}</a></p>`,
  ]);

  await postRequest(url, getGithubHeaders(accessToken), {
    body: githubCommentBody,
  });
}

export async function sendGithubComment(
  linkedIssue: LinkedIssue,
  accessToken: string,
  body: string,
) {
  const { apiUrl } = linkedIssue.sourceData as LinkedIssueSourceData;
  const url = `${apiUrl}/comments`;
  const headers = getGithubHeaders(accessToken);

  return postRequest(url, headers, { body });
}

export async function getGithubSettings(
  integrationAccount: IntegrationAccountWithRelations,
  token: string,
): Promise<GithubSettings> {
  const installationId = integrationAccount.accountId;
  const [org, repos] = await Promise.all([
    getRequest(
      `https://api.github.com/app/installations/${installationId}`,
      getGithubHeaders(await getBotJWTToken(integrationAccount)),
    ).then((response) => response.data),
    getRequest(
      `https://api.github.com/user/installations/${installationId}/repositories`,
      getGithubHeaders(token),
    ).then((response) => response.data),
  ]);

  if (!org) {
    return {} as GithubSettings;
  }

  return {
    orgAvatarURL: org.account.avatar_url,
    orgLogin: org.account.login,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repositories: repos?.repositories.map((repo: any) => ({
      id: repo.id.toString(),
      fullName: repo.full_name,
      name: repo.name,
      private: repo.private,
    })),
    repositoryMappings: [],
  } as GithubSettings;
}

export function getGithubHeaders(token: string) {
  return {
    headers: {
      ...githubHeaders,
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getAccessToken(
  prisma: PrismaService,
  integrationAccount: IntegrationAccount,
) {
  const config = integrationAccount.integrationConfiguration as Record<
    string,
    string
  >;
  const currentDate = Date.now();
  const accessExpiresIn = Number(config.access_expires_in);

  if (!accessExpiresIn || currentDate >= accessExpiresIn) {
    const { client_id, client_secret, refresh_token } = config;
    const url = `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}&grant_type=refresh_token`;

    const { data } = await axios.post(url);
    const tokens = new URLSearchParams(data);

    const expiresIn = Number(tokens.get('expires_in')) * 1000;
    const refreshExpiresIn =
      Number(tokens.get('refresh_token_expires_in')) * 1000;

    config.refresh_token = tokens.get('refresh_token');
    config.access_token = tokens.get('access_token');
    config.access_expires_in = (currentDate + expiresIn).toString();
    config.refresh_expires_in = (currentDate + refreshExpiresIn).toString();

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

  // Read private key synchronously to avoid unnecessary async operation
  const privateKey = await fs.readFile(privateKeyPath, 'utf8');

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60, // issued at time, 60 seconds in the past to allow for clock drift
    exp: now + 600, // JWT expiration time (10 minutes)
    iss: appId, // GitHub App's identifier
  };

  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

export async function getBotAccessToken(
  prisma: PrismaService,
  integrationAccount: IntegrationAccountWithRelations,
) {
  const config = integrationAccount.integrationConfiguration as Record<
    string,
    string
  >;
  const currentTime = Date.now();
  const expiresAt = config.expires_at
    ? new Date(config.expires_at).getTime()
    : 0;

  if (!config.access_token || currentTime > expiresAt) {
    const token = await getBotJWTToken(integrationAccount);
    const url = `https://api.github.com/app/installations/${integrationAccount.accountId}/access_tokens`;
    const { data: accessResponse } = await postRequest(
      url,
      getGithubHeaders(token),
      {},
    );

    const updatedConfig = {
      access_token: accessResponse.token,
      expires_at: accessResponse.expires_at,
    };

    await prisma.integrationAccount.update({
      where: { id: integrationAccount.id },
      data: { integrationConfiguration: updatedConfig },
    });

    return accessResponse.token;
  }

  return config.access_token;
}

async function getGithubUserIntegrationAccount(
  prisma: PrismaService,
  userId: string,
  workspaceId: string,
) {
  return prisma.integrationAccount.findFirst({
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
  const labels = await prisma.label.findMany({
    where: {
      id: {
        in: labelIds,
      },
    },
    select: {
      name: true,
    },
  });
  return labels.map((label) => label.name);
}

export async function getGithubUser(token: string) {
  return (
    (await getRequest('https://api.github.com/user', getGithubHeaders(token)))
      .data ?? {}
  );
}

export async function upsertGithubIssue(
  prisma: PrismaService,
  logger: Logger,
  issue: IssueWithRelations,
  integrationAccount: IntegrationAccountWithRelations,
  userId: string,
) {
  const IntegrationSettings = integrationAccount.settings as Settings;

  const [stateCategory, assigneeGithubUser, linkedIssue] = await Promise.all([
    prisma.workflow
      .findUnique({
        where: { id: issue.stateId },
        select: { category: true },
      })
      .then((result) => result.category as WorkflowCategory),
    getGithubUserIntegrationAccount(
      prisma,
      issue.assigneeId,
      issue.team.workspaceId,
    ),
    prisma.linkedIssue.findFirst({
      where: {
        issueId: issue.id,
        source: { path: ['type'], equals: IntegrationName.Github },
      },
    }),
  ]);

  logger.debug(`Assignee GitHub user: ${JSON.stringify(assigneeGithubUser)}`);

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

  if (linkedIssue) {
    logger.debug(`Found a Linked issue: ${linkedIssue.id}`);

    const userGithubIntegrationAccount = await getGithubUserIntegrationAccount(
      prisma,
      userId,
      issue.team.workspaceId,
    );

    logger.debug(
      `User GitHub integration account: ${userGithubIntegrationAccount.id}`,
    );

    const accessToken = userGithubIntegrationAccount
      ? await getAccessToken(prisma, userGithubIntegrationAccount)
      : await getBotAccessToken(prisma, integrationAccount);

    return (
      await postRequest(
        (linkedIssue.sourceData as LinkedIssueSourceData).apiUrl,
        getGithubHeaders(accessToken),
        issueBody,
      )
    ).data;
  }

  const [accessToken, defaultRepo] = await Promise.all([
    getBotAccessToken(prisma, integrationAccount),
    IntegrationSettings[IntegrationName.Github].repositoryMappings.find(
      (repo: GithubRepositoryMappings) => repo.default,
    ),
  ]);

  logger.debug(`Default repo: ${JSON.stringify(defaultRepo)}`);

  if (defaultRepo) {
    const url = `https://api.github.com/repos/${defaultRepo.githubRepoFullName}/issues`;
    logger.log(`URL: ${url}`);
    return (await postRequest(url, getGithubHeaders(accessToken), issueBody))
      .data;
  }

  return undefined;
}

export async function upsertGithubIssueComment(
  prisma: PrismaService,
  logger: Logger,
  issueComment: IssueCommentWithRelations,
  integrationAccount: IntegrationAccountWithRelations,
  userId: string,
  action: IssueCommentAction,
) {
  logger.debug(`Upserting GitHub issue comment for action: ${action}`);

  const userGithubIntegrationAccount = await getGithubUserIntegrationAccount(
    prisma,
    userId,
    issueComment.issue.team.workspaceId,
  );

  const accessToken = userGithubIntegrationAccount
    ? await getAccessToken(prisma, userGithubIntegrationAccount)
    : await getBotAccessToken(prisma, integrationAccount);

  const linkedComment = await prisma.linkedComment.findFirst({
    where: {
      commentId: issueComment.id,
      source: { path: ['type'], equals: IntegrationName.Github },
    },
  });

  switch (action) {
    case IssueCommentAction.CREATED:
      logger.debug('Creating GitHub issue comment');
      const linkedIssue = await prisma.linkedIssue.findFirst({
        where: { issueId: issueComment.issueId },
      });

      if (linkedIssue) {
        const url = `${(linkedIssue.sourceData as LinkedIssueSourceData).apiUrl}/comments`;
        const githubIssueComment = (
          await postRequest(url, getGithubHeaders(accessToken), {
            body: issueComment.body,
          })
        ).data;
        const sourceMetadata = {
          id: githubIssueComment.id,
          body: githubIssueComment.body,
          displayUserName: githubIssueComment.user.login,
          apiUrl: githubIssueComment.url,
        };
        await prisma.$transaction([
          prisma.linkedComment.create({
            data: {
              sourceId: githubIssueComment.id.toString(),
              url: githubIssueComment.html_url,
              source: { type: IntegrationName.Github },
              sourceData: sourceMetadata,
              commentId: issueComment.id,
              createdById: userId,
            },
          }),
          prisma.issueComment.update({
            where: { id: issueComment.id },
            data: { sourceMetadata },
          }),
        ]);
        logger.debug('GitHub issue comment created successfully');
        return githubIssueComment;
      }
      logger.debug('Linked issue not found, skipping comment creation');
      return undefined;

    case IssueCommentAction.UPDATED:
      logger.debug('Updating GitHub issue comment');
      if (linkedComment) {
        const updatedComment = await postRequest(
          (linkedComment.sourceData as LinkedCommentSourceData).apiUrl,
          getGithubHeaders(accessToken),
          {
            body: issueComment.body,
          },
        );
        logger.debug('GitHub issue comment updated successfully');
        return updatedComment;
      }
      logger.debug('Linked comment not found, skipping comment update');
      return undefined;

    case IssueCommentAction.DELETED:
      logger.debug('Deleting GitHub issue comment');
      if (linkedComment) {
        const deleteResponse = await deleteRequest(
          (linkedComment.sourceData as LinkedCommentSourceData).apiUrl,
          getGithubHeaders(accessToken),
        );

        await prisma.linkedComment.update({
          where: { id: linkedComment.id },
          data: { deleted: new Date().toISOString() },
        });
        logger.debug('GitHub issue comment deleted successfully');
        return deleteResponse;
      }
      logger.debug('Linked comment not found, skipping comment deletion');
      return undefined;
  }
}
