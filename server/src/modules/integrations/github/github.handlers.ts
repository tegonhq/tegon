import {
  IntegrationAccountWithRelations,
  Settings,
} from 'modules/integration-account/integration-account.interface';
import IssuesService from 'modules/issues/issues.service';
import { WebhookEventBody } from 'modules/webhooks/webhooks.interface';
import { PrismaService } from 'nestjs-prisma';
import {
  getIssueData,
  getOrCreateLabelIds,
  getState,
  getTeamId,
  getUserId,
  sendGithubFirstComment,
  sendGithubPRFirstComment,
} from './github.utils';
import {
  CreateIssueInput,
  IssueRequestParams,
  LinkedIssueSubType,
  TeamRequestParams,
  UpdateIssueInput,
} from 'modules/issues/issues.interface';
import { Logger } from '@nestjs/common';
import { IntegrationName, LinkedIssue, Prisma } from '@prisma/client';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';
import {
  LinkedIssueSource,
  LinkedIssueSourceData,
} from 'modules/linked-issue/linked-issue.interface';

export async function handleIssues(
  prisma: PrismaService,
  logger: Logger,
  linkedIssueService: LinkedIssueService,
  issuesService: IssuesService,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccountWithRelations,
) {
  const accountSettings = integrationAccount.settings as Settings;
  const teamId = getTeamId(eventBody.repository.id.toString(), accountSettings);

  if (!teamId) {
    logger.log(`No teamId found for repository ${eventBody.repository.id}`);
    return {};
  }

  const { action, issue, assignee } = eventBody;
  const linkedIssue = await linkedIssueService.getLinkedIssueBySourceId(
    issue.id,
  );

  const issueData = await getIssueData(
    prisma,
    eventBody,
    integrationAccount,
    teamId,
  );

  const updateIssue = async (input: UpdateIssueInput) => {
    if (!linkedIssue?.issueId) {
      logger.log(`No linked issue found for GitHub issue ${issue.id}`);
      return {};
    }
    logger.log(
      `Updating issue ${linkedIssue.issueId} for GitHub issue ${issue.id}`,
    );
    return issuesService.updateIssue(
      { teamId } as TeamRequestParams,
      input,
      { issueId: linkedIssue.issueId } as IssueRequestParams,
      issueData.userId,
      issueData.linkIssueData,
      issueData.sourceMetadata,
    );
  };

  switch (action) {
    case 'opened': {
      logger.log(`Creating new issue for GitHub issue ${issue.id}`);
      const createdIssue = await issuesService.createIssueAPI(
        { teamId } as TeamRequestParams,
        issueData.issueInput as CreateIssueInput,
        issueData.userId,
        issueData.linkIssueData,
        issueData.sourceMetadata,
      );

      await sendGithubFirstComment(
        prisma,
        logger,
        linkedIssueService,
        integrationAccount,
        createdIssue,
        issue.id,
      );
      return createdIssue;
    }

    case 'edited':
    case 'reopened':
    case 'closed':
      logger.log(
        `Updating issue for GitHub issue ${issue.id} with action ${action}`,
      );
      return updateIssue(issueData.issueInput as UpdateIssueInput);

    case 'labeled':
    case 'unlabeled': {
      logger.log(
        `Updating labels for GitHub issue ${issue.id} with action ${action}`,
      );
      const labelIds = await getOrCreateLabelIds(
        prisma,
        issue.labels,
        teamId,
        integrationAccount.workspaceId,
      );
      return updateIssue({
        labelIds,
        ...issueData.issueInput,
      } as UpdateIssueInput);
    }

    case 'assigned':
    case 'unassigned': {
      logger.log(
        `Updating assignee for GitHub issue ${issue.id} with action ${action}`,
      );
      const assigneeId =
        action === 'assigned' ? await getUserId(prisma, assignee) : null;
      return assigneeId || action !== 'assigned'
        ? updateIssue({
            assigneeId,
            ...issueData.issueInput,
          } as UpdateIssueInput)
        : {};
    }

    default:
      logger.debug(`Unhandled GitHub issue action: ${action}`);
      return {};
  }
}

export async function handleIssueComments(
  prisma: PrismaService,
  logger: Logger,
  linkedIssueService: LinkedIssueService,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccountWithRelations,
) {
  const linkedIssue = await linkedIssueService.getLinkedIssueBySourceId(
    eventBody.issue.id,
  );
  if (!linkedIssue) {
    logger.debug(
      `No linked issue found for GitHub issue ID: ${eventBody.issue.id}`,
    );
    return undefined;
  }

  const { issueId, source: linkedIssueSource } = linkedIssue;
  const parentId = (linkedIssueSource as Record<string, string>)
    .syncedCommentId;
  const userId = await getUserId(prisma, eventBody.sender);

  const linkedComment = await prisma.linkedComment.findFirst({
    where: { sourceId: eventBody.comment.id.toString() },
    include: { comment: true },
  });

  switch (eventBody.action) {
    case 'created':
      if (linkedComment) {
        logger.debug(
          `Linked comment already exists for GitHub comment ID: ${eventBody.comment.id}`,
        );
        return linkedComment.comment;
      }
      logger.log(
        `Creating new linked comment for GitHub comment ID: ${eventBody.comment.id}`,
      );
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

    case 'edited':
      if (linkedComment) {
        logger.log(
          `Updating linked comment for GitHub comment ID: ${eventBody.comment.id}`,
        );
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
      logger.debug(
        `No linked comment found to update for GitHub comment ID: ${eventBody.comment.id}`,
      );
      return undefined;

    case 'deleted':
      if (linkedComment) {
        logger.log(
          `Marking linked comment as deleted for GitHub comment ID: ${eventBody.comment.id}`,
        );
        const now = new Date().toISOString();
        return await prisma.issueComment.update({
          where: { id: linkedComment.commentId },
          data: {
            deleted: now,
            linkedComment: {
              update: {
                where: { id: linkedComment.id },
                data: {
                  deleted: now,
                },
              },
            },
          },
        });
      }
      logger.debug(
        `No linked comment found to delete for GitHub comment ID: ${eventBody.comment.id}`,
      );
      return undefined;

    default:
      logger.debug(`Unsupported Issue Comment action: ${eventBody.action}`);
      return undefined;
  }
}

export async function handlePullRequests(
  prisma: PrismaService,
  logger: Logger,
  issuesService: IssuesService,
  linkedIssueService: LinkedIssueService,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccountWithRelations,
): Promise<LinkedIssue | undefined> {
  const { pull_request: pullRequest, action, sender } = eventBody;
  const branchName = pullRequest.head.ref;
  const branchNameRegex = /^([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)-(\d+)$/;
  const match = branchName.match(branchNameRegex);

  logger.debug(
    `Handling pull request event: action=${action}, branchName=${branchName}`,
  );

  if (!match) {
    logger.debug(
      `Branch name ${branchName} does not match the expected format`,
    );
    return undefined;
  }

  const [, userName, teamSlug, issueNumber] = match;

  logger.debug(
    `Extracted from branch name: userName=${userName}, teamSlug=${teamSlug}, issueNumber=${issueNumber}`,
  );

  const [user, team] = await Promise.all([
    prisma.user.findFirst({
      where: { username: { equals: userName, mode: 'insensitive' } },
    }),
    prisma.team.findFirst({
      where: { identifier: { equals: teamSlug, mode: 'insensitive' } },
    }),
  ]);

  const issue = await prisma.issue.findFirst({
    where: { number: Number(issueNumber), teamId: team.id },
  });

  if (!user || !team || !issue) {
    logger.debug(
      `User, team, or issue not found: user=${user}, team=${team}, issue=${issue}`,
    );
    return undefined;
  }

  const pullRequestId = pullRequest.id.toString();
  const sourceData = {
    branch: pullRequest.head.ref,
    id: pullRequestId,
    closedAt: pullRequest.closed_at,
    createdAt: pullRequest.created_at,
    updatedAt: pullRequest.updated_at,
    number: pullRequest.number,
    state: pullRequest.state,
    title: pullRequest.title,
    apiUrl: pullRequest.url,
    mergedAt: pullRequest.merged_at,
  };

  logger.log(`Pull request data: pullRequestId=${pullRequestId}}`);

  switch (action) {
    case 'opened': {
      const linkedIssue = await linkedIssueService.createLinkIssueAPI({
        url: pullRequest.html_url,
        sourceId: pullRequestId,
        issueId: issue.id,
        source: {
          type: IntegrationName.Github,
          subType: LinkedIssueSubType.GithubPullRequest,
          pullRequestId,
        },
        sourceData,
        createdById: user.id,
      });

      logger.log(`Created linked issue: linkedIssue=${linkedIssue.id}`);

      await sendGithubPRFirstComment(
        prisma,
        integrationAccount,
        team,
        issue,
        pullRequest.comments_url,
      );

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

      const linkedIssueMap = openPRs.reduce(
        (map, linkedIssue) => map.set(linkedIssue.sourceId, linkedIssue.id),
        new Map<string, string>(),
      );

      logger.log(
        `Found ${openPRs.length} open pull requests for issue ${issue.id}`,
      );

      if (linkedIssueMap.has(pullRequestId)) {
        const linkedIssueId = linkedIssueMap.get(pullRequestId)!;
        const linkedIssue = await prisma.linkedIssue.update({
          where: { id: linkedIssueId },
          data: { sourceData },
        });

        logger.log(`Updated linked issue: linkedIssue=${linkedIssue.id}`);

        if (openPRs.length <= 1 && sourceData.mergedAt) {
          const stateId = await getState(prisma, 'closed', team.id);
          if (stateId) {
            await issuesService.updateIssue(
              { teamId: team.id } as TeamRequestParams,
              { stateId } as UpdateIssueInput,
              { issueId: linkedIssue.issueId } as IssueRequestParams,
              user.id,
              null,
              {
                id: integrationAccount.id,
                type: IntegrationName.Github,
                userDisplayName: sender.login,
              },
            );
            logger.log(
              `Updated issue state to closed: issueId=${linkedIssue.issueId}`,
            );
          }
        }

        return linkedIssue;
      }

      logger.debug(
        `No matching linked issue found for pull request ${pullRequestId}`,
      );
      return undefined;
    }

    default:
      logger.debug(`Unhandled pull request action: ${action}`);
      return undefined;
  }
}

export async function handleRepositories(
  prisma: PrismaService,
  logger: Logger,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccountWithRelations,
) {
  const integrationAccountSettings = integrationAccount.settings as Settings;
  const repositories =
    eventBody.action === 'added'
      ? eventBody.repositories_added
      : eventBody.repositories_removed;

  logger.log(
    `Handling ${eventBody.action} repositories event for IntegrationAccount ${integrationAccount.id}`,
  );
  logger.debug(`Repositories: ${JSON.stringify(repositories)}`);

  const currentRepositories = integrationAccountSettings.Github.repositories;

  const repoMap = new Map(
    currentRepositories.map((repo) => [repo.id.toString(), repo]),
  );

  switch (eventBody.action) {
    case 'added':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      repositories.forEach((repo: any) => {
        repoMap.set(repo.id.toString(), {
          id: repo.id.toString(),
          fullName: repo.full_name,
          name: repo.name,
          private: repo.private,
        });
      });
      logger.debug(`Added repositories to repoMap`);
      break;
    case 'removed':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      repositories.forEach((repo: any) => {
        repoMap.delete(repo.id.toString());
      });
      logger.debug(`Removed repositories from repoMap`);
      break;

    default:
      logger.debug(`Unsupported action: ${eventBody.action}`);
      return undefined;
  }

  integrationAccountSettings.Github.repositories = Array.from(repoMap.values());

  logger.log(
    `Updating integration account ${integrationAccount.id} settings with repositories`,
  );

  return await prisma.integrationAccount.update({
    where: { id: integrationAccount.id },
    data: {
      settings: integrationAccountSettings as Prisma.JsonObject,
    },
  });
}

export async function handleInstallations(
  prisma: PrismaService,
  logger: Logger,
  eventBody: WebhookEventBody,
  integrationAccount: IntegrationAccountWithRelations,
) {
  if (eventBody.action === 'installed') {
    logger.debug('Skipping handling for "installed" action');
    return undefined;
  }

  const updateData: Prisma.IntegrationAccountUpdateInput = {
    isActive: eventBody.action === 'unsuspend',
    ...(eventBody.action === 'deleted' && { deleted: new Date() }),
  };

  logger.log(
    `Updating integration account ${integrationAccount.id} with data:`,
    updateData,
  );

  return prisma.integrationAccount.update({
    where: { id: integrationAccount.id },
    data: updateData,
  });
}
