import fs from 'fs/promises';
import path from 'path';

import { Team } from '@@generated/team/entities';
import { BadRequestException, Logger } from '@nestjs/common';
import {
  IntegrationAccount,
  IntegrationName,
  Issue,
  LinkedIssue,
  WorkflowCategory,
} from '@prisma/client';
import { IssueWithRelations } from '@tegonhq/types';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { PrismaService } from 'nestjs-prisma';

import {
  convertMarkdownToTiptapJson,
  convertTiptapJsonToMarkdown,
} from 'common/utils/tiptap.utils';

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
import { UpdateIssueInput } from 'modules/issues/issues.interface';
import {
  LinkIssueData,
  LinkedIssueSourceData,
  LinkedIssueSubType,
} from 'modules/linked-issue/linked-issue.interface';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';

import { githubHeaders, githubIssueData } from './github.interface';
import { EventBody } from '../integrations.interface';
import {
  deleteRequest,
  getOrCreateLabelIds,
  getRequest,
  getUserId,
  postRequest,
} from '../integrations.utils';

/**
 * Retrieves the state based on the GitHub action and team ID.
 * @param prisma The PrismaService instance to get workflow.
 * @param action The GitHub action (e.g., 'opened', 'closed', 'reopened').
 * @param teamId The ID of the team.
 * @returns The state ID if a matching workflow is found, or undefined otherwise.
 */
export async function getState(
  prisma: PrismaService,
  action: string,
  teamId: string,
): Promise<string> {
  // Determine the workflow category based on the GitHub action
  const category =
    action === 'opened' || action === 'reopened'
      ? 'TRIAGE'
      : action === 'closed'
        ? 'COMPLETED'
        : null;

  if (category) {
    // Find the first workflow matching the team ID and category, ordered by position
    const workflow = await prisma.workflow.findFirst({
      where: { teamId, category },
      orderBy: { position: 'asc' },
    });
    // Return the workflow ID if found
    return workflow?.id;
  }

  // Return undefined if no matching workflow is found
  return undefined;
}

/**
 * Retrieves the team ID associated with a given repository ID from the account settings.
 * @param repoId The ID of the GitHub repository.
 * @param accountSettings The account settings object containing the GitHub settings.
 * @returns The team ID associated with the repository, or undefined if no mapping is found.
 */
export function getTeamId(
  repoId: string,
  accountSettings: Settings,
): string | undefined {
  // Get the GitHub settings from the account settings
  const githubSettings = accountSettings[IntegrationName.Github];

  // Find the repository mapping that matches the given repository ID
  const mapping = githubSettings.repositoryMappings.find(
    (mapping) => mapping.githubRepoId === repoId,
  );

  // Return the team ID from the mapping, or undefined if no mapping is found
  return mapping?.teamId;
}

/**
 * Retrieves the necessary data for creating or updating an issue based on a GitHub webhook event.
 * @param prisma The PrismaService instance to get state, userIds and labels.
 * @param eventBody The body of the GitHub webhook event.
 * @param integrationAccount The integration account associated with the event.
 * @param teamId The ID of the team associated with the event.
 * @returns An object containing the link issue data, issue input, source metadata, and user ID.
 */
export async function getIssueData(
  prisma: PrismaService,
  eventBody: EventBody,
  integrationAccount: IntegrationAccount,
  teamId: string,
): Promise<githubIssueData> {
  // Retrieve the state ID, user ID, issue label IDs, and assignee ID concurrently
  const [stateId, userId, issueLabelIds, assigneeId] = await Promise.all([
    getState(prisma, eventBody.action, teamId),
    getUserId(prisma, eventBody.sender),
    getOrCreateLabelIds(
      prisma,
      eventBody.issue.labels,
      teamId,
      integrationAccount.workspaceId,
    ),
    getUserId(prisma, eventBody.issue.assignee),
  ]);

  // Prepare the link issue data
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

  // Prepare the issue input data
  const issueInput: UpdateIssueInput = {
    title: eventBody.issue.title,
    description: convertMarkdownToTiptapJson(eventBody.issue.body),
    stateId,
    isBidirectional: true,
    ...(issueLabelIds && { labelIds: issueLabelIds }),
    assigneeId,
    subscriberIds: [
      ...(userId ? [userId] : []),
      ...(assigneeId ? [assigneeId] : []),
    ],
  } as UpdateIssueInput;

  // Prepare the source metadata
  const sourceMetadata = {
    id: integrationAccount.id,
    type: IntegrationName.Github,
    userDisplayName: eventBody.sender.login,
  };

  // Return the collected data
  return { linkIssueData, issueInput, sourceMetadata, userId };
}

/**
 * Sends the first comment for an issue to GitHub.
 * @param prisma The PrismaService instance to get access tokens and team.
 * @param logger The Logger instance.
 * @param linkedIssueService The LinkedIssueService instance for updating syncedCommentId.
 * @param integrationAccount The integration account with relations.
 * @param issue The issue object.
 * @param issueSourceId The source ID of the issue.
 */
export async function sendGithubFirstComment(
  prisma: PrismaService,
  logger: Logger,
  linkedIssueService: LinkedIssueService,
  integrationAccount: IntegrationAccountWithRelations,
  issue: IssueWithRelations,
  issueSourceId: string,
) {
  const { workspace } = integrationAccount;
  const { id: issueId, teamId, number, title } = issue;

  logger.log(`Sending first comment for issue ${issueId} to GitHub`);

  // Retrieve access token, team, and linked issue concurrently
  const [accessToken, team, linkedIssue] = await Promise.all([
    getBotAccessToken(prisma, integrationAccount),
    prisma.team.findUnique({ where: { id: teamId } }),
    linkedIssueService.getLinkedIssueBySourceId(issueSourceId.toString()),
  ]);

  logger.debug(
    `Access token, team, and linked issue retrieved for issue ${issueId}`,
  );

  // Create the comment body and source metadata
  const commentBody = `${IntegrationName.Github} thread in ${title}`;
  const sourceMetadata = issue.sourceMetadata
    ? issue.sourceMetadata
    : { id: integrationAccount.id, type: IntegrationName.Github };

  // Create the issue comment in the database
  const issueComment = await prisma.issueComment.create({
    data: {
      body: commentBody,
      issueId,
      sourceMetadata,
    },
  });

  logger.debug(`Issue comment created for issue ${issueId}`);

  // Update the linked issue with the synced comment ID
  await linkedIssueService.updateLinkIssue(
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

  // Create the GitHub comment body with a link to the issue
  const githubCommentBody = `[${team.identifier}-${number} ${title}](${process.env.PUBLIC_FRONTEND_HOST}/${workspace.slug}/issue/${team.identifier}-${number})`;

  // Send the comment to GitHub
  await sendGithubComment(linkedIssue, accessToken, githubCommentBody);

  logger.log(`GitHub comment sent for issue ${issueId}`);
}

/**
 * Sends the first comment for a pull request to GitHub.
 * @param prisma The PrismaService instance to get access tokens.
 * @param integrationAccount The integration account with relations.
 * @param team The team object.
 * @param issue The issue object.
 * @param url The URL to post the comment to.
 */
export async function sendGithubPRFirstComment(
  prisma: PrismaService,
  integrationAccount: IntegrationAccountWithRelations,
  team: Team,
  issue: Issue,
  url: string,
) {
  const { workspace } = integrationAccount;
  const { number, title } = issue;

  // Get the bot access token for the integration account
  const accessToken = await getBotAccessToken(prisma, integrationAccount);

  // Create the comment body with a link to the issue in the frontend
  const githubCommentBody = `[${team.identifier}-${number} ${title}](${process.env.PUBLIC_FRONTEND_HOST}/${workspace.slug}/issue/${team.identifier}-${number})`;

  // Post the comment to the provided URL using the GitHub API
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
  // Get the integration configuration as a Record<string, string>
  const config = integrationAccount.integrationConfiguration as Record<
    string,
    string
  >;
  // Get the current timestamp
  const currentDate = Date.now();
  // Get the access token expiration timestamp
  const accessExpiresIn = Number(config.access_expires_in);

  // If the access token is expired or not set
  if (!accessExpiresIn || currentDate >= accessExpiresIn) {
    // Get the client ID, client secret, and refresh token from the configuration
    const { client_id, client_secret, refresh_token } = config;
    const url = `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}&grant_type=refresh_token`;

    // Send a POST request to refresh the access token
    const { data } = await axios.post(url);
    // Parse the response data as URL search params
    const tokens = new URLSearchParams(data);

    // Get the new access token expiration time in milliseconds
    const expiresIn = Number(tokens.get('expires_in')) * 1000;
    // Get the new refresh token expiration time in milliseconds
    const refreshExpiresIn =
      Number(tokens.get('refresh_token_expires_in')) * 1000;

    // Update the configuration with the new refresh token, access token, and expiration times
    config.refresh_token = tokens.get('refresh_token');
    config.access_token = tokens.get('access_token');
    config.access_expires_in = (currentDate + expiresIn).toString();
    config.refresh_expires_in = (currentDate + refreshExpiresIn).toString();

    // Update the integration account in the database with the new configuration
    await prisma.integrationAccount.update({
      where: { id: integrationAccount.id },
      data: { integrationConfiguration: config },
    });
  }

  // Return the access token
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
  let config = integrationAccount.integrationConfiguration as Record<
    string,
    string
  >;

  const currentTime = Date.now();

  // Get the expiration timestamp from the configuration, or set it to 0 if not available
  const expiresAt = config.expires_at
    ? new Date(config.expires_at).getTime()
    : 0;

  // If the access token is missing or has expired
  if (!config.access_token || currentTime > expiresAt) {
    // Get a new bot JWT token
    const token = await getBotJWTToken(integrationAccount);

    // Construct the URL to request a new access token
    const url = `https://api.github.com/app/installations/${integrationAccount.accountId}/access_tokens`;

    const { data: accessResponse } = await postRequest(
      url,
      getGithubHeaders(token),
      {},
    );

    // Prepare the updated configuration with the new access token and expiration timestamp
    config = {
      access_token: accessResponse.token,
      expires_at: accessResponse.expires_at,
    };

    // Update the integration account with the new configuration in the database
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
  if (!userId) {
    return null;
  }

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
  linkedIssueId?: string,
) {
  // Get the integration settings from the integration account
  const IntegrationSettings = integrationAccount.settings as Settings;

  let stateCategory: WorkflowCategory | null = null;
  let assigneeGithubUser: IntegrationAccount | null = null;
  let linkedIssue: LinkedIssue | null = null;

  try {
    // Fetch the state category, assignee GitHub user, and linked issue in parallel
    [stateCategory, assigneeGithubUser, linkedIssue] = await Promise.all([
      // Get the state category from the workflow
      prisma.workflow
        .findUnique({
          where: { id: issue.stateId },
          select: { category: true },
        })
        .then((result) => result?.category as WorkflowCategory),
      // Get the assignee's GitHub integration account
      getGithubUserIntegrationAccount(
        prisma,
        issue.assigneeId,
        issue.team.workspaceId,
      ),
      // Find the linked issue for the current issue
      linkedIssueId
        ? prisma.linkedIssue.findUnique({ where: { id: linkedIssueId } })
        : prisma.linkedIssue.findFirst({
            where: {
              issueId: issue.id,
              source: { path: ['type'], equals: IntegrationName.Github },
            },
          }),
    ]);
  } catch (error) {
    logger.error(`Error fetching data: ${error.message}`);
    return new BadRequestException(`Error fetching data`);
  }

  logger.debug(`Assignee GitHub user: ${JSON.stringify(assigneeGithubUser)}`);

  // Prepare the issue body for GitHub API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const issueBody: any = {
    title: issue.title,
    ...(issue.description
      ? { body: convertTiptapJsonToMarkdown(issue.description) }
      : {}),
    labels: await getGithubLabels(prisma, issue.labelIds),
    state:
      stateCategory === WorkflowCategory.COMPLETED ||
      stateCategory === WorkflowCategory.CANCELED
        ? 'closed'
        : 'open',
    state_reason:
      stateCategory === WorkflowCategory.COMPLETED
        ? 'completed'
        : stateCategory === WorkflowCategory.CANCELED
          ? 'not_planned'
          : null,
  };

  // Add assignee to the issue body if available
  if (assigneeGithubUser) {
    issueBody.assignees = [
      (assigneeGithubUser.settings as Settings).GithubPersonal.login,
    ];
  }

  // If a linked issue exists, update it on GitHub
  if (linkedIssue) {
    logger.debug(`Found a Linked issue: ${linkedIssue.id}`);

    // Get the user's GitHub integration account
    const userGithubIntegrationAccount = await getGithubUserIntegrationAccount(
      prisma,
      userId,
      issue.team.workspaceId,
    );

    logger.debug(
      `User GitHub integration account: ${userGithubIntegrationAccount.id}`,
    );

    // Get the access token based on user or bot integration account
    const accessToken = userGithubIntegrationAccount
      ? await getAccessToken(prisma, userGithubIntegrationAccount)
      : await getBotAccessToken(prisma, integrationAccount);

    // Update the linked issue on GitHub
    return (
      await postRequest(
        (linkedIssue.sourceData as LinkedIssueSourceData).apiUrl,
        getGithubHeaders(accessToken),
        issueBody,
      )
    ).data;
  }

  // If no linked issue, create a new issue on the default repository
  const [accessToken, defaultRepo] = await Promise.all([
    // Get the bot access token
    getBotAccessToken(prisma, integrationAccount),
    // Find the default repository mapping
    IntegrationSettings[IntegrationName.Github].repositoryMappings.find(
      (repo: GithubRepositoryMappings) => repo.default,
    ),
  ]);

  logger.debug(`Default repo: ${JSON.stringify(defaultRepo)}`);

  // If a default repository is found, create the issue on GitHub
  if (defaultRepo) {
    const url = `https://api.github.com/repos/${defaultRepo.githubRepoFullName}/issues`;
    logger.log(`URL: ${url}`);
    return (await postRequest(url, getGithubHeaders(accessToken), issueBody))
      .data;
  }

  // If no default repository is found, return undefined
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

  // Get the user's GitHub integration account or the bot's access token
  const userGithubIntegrationAccount = await getGithubUserIntegrationAccount(
    prisma,
    userId,
    issueComment.issue.team.workspaceId,
  );

  const accessToken = userGithubIntegrationAccount
    ? await getAccessToken(prisma, userGithubIntegrationAccount)
    : await getBotAccessToken(prisma, integrationAccount);

  // Find the linked comment for the issue comment
  const linkedComment = await prisma.linkedComment.findFirst({
    where: {
      commentId: issueComment.id,
      source: { path: ['type'], equals: IntegrationName.Github },
    },
  });

  switch (action) {
    case IssueCommentAction.CREATED:
      logger.debug('Creating GitHub issue comment');
      // Find the linked issue for the parent comment
      const linkedIssue = await prisma.linkedIssue.findFirst({
        where: {
          source: { path: ['syncedCommentId'], equals: issueComment.parentId },
        },
      });

      if (linkedIssue) {
        // Create the GitHub issue comment
        const url = `${(linkedIssue.sourceData as LinkedIssueSourceData).apiUrl}/comments`;
        const githubIssueComment = (
          await postRequest(url, getGithubHeaders(accessToken), {
            body: convertTiptapJsonToMarkdown(issueComment.body),
          })
        ).data;
        const sourceMetadata = {
          id: githubIssueComment.id,
          body: githubIssueComment.body,
          displayUserName: githubIssueComment.user.login,
          apiUrl: githubIssueComment.url,
        };
        // Create the linked comment and update the issue comment with source metadata
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
        // Update the GitHub issue comment
        const updatedComment = await postRequest(
          (linkedComment.sourceData as LinkedCommentSourceData).apiUrl,
          getGithubHeaders(accessToken),
          {
            body: convertTiptapJsonToMarkdown(issueComment.body),
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
        // Delete the GitHub issue comment
        const deleteResponse = await deleteRequest(
          (linkedComment.sourceData as LinkedCommentSourceData).apiUrl,
          getGithubHeaders(accessToken),
        );

        // Update the linked comment as deleted
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
