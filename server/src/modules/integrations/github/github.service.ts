/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable, Logger } from '@nestjs/common';
import { IntegrationName, LinkedIssue, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { convertMarkdownToTiptapJson } from 'common/utils/tiptap.utils';

import {
  IntegrationAccountWithRelations,
  Settings,
} from 'modules/integration-account/integration-account.interface';
import {
  CreateIssueInput,
  IssueRequestParams,
  IssueWithRelations,
  TeamRequestParams,
  UpdateIssueInput,
} from 'modules/issues/issues.interface';
import IssuesService from 'modules/issues/issues.service';
import {
  LinkedIssueSource,
  LinkedIssueSourceData,
  LinkedIssueSubType,
} from 'modules/linked-issue/linked-issue.interface';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';
import { NotificationEventFrom } from 'modules/notifications/notifications.interface';
import NotificationsService from 'modules/notifications/notifications.service';

import { eventsToListen } from './github.interface';
import {
  getIssueData,
  getState,
  getTeamId,
  sendGithubFirstComment,
  sendGithubPRFirstComment,
} from './github.utils';
import { EventBody, EventHeaders } from '../integrations.interface';
import { getOrCreateLabelIds, getUserId } from '../integrations.utils';

@Injectable()
export default class GithubService {
  constructor(
    private prisma: PrismaService,
    private issuesService: IssuesService,
    private linkedIssueService: LinkedIssueService,
    private notificationsService: NotificationsService,
  ) {}
  private readonly logger: Logger = new Logger('GithubService', {
    timestamp: true,
  });

  async handleEvents(eventHeaders: EventHeaders, eventBody: EventBody) {
    const eventType = eventHeaders['x-github-event'];
    if (
      eventsToListen.has(eventType) &&
      !['tegon-bot[bot]', 'tegon-bot-dev[bot]'].includes(eventBody.sender.login)
    ) {
      const integrationAccount = await this.prisma.integrationAccount.findFirst(
        {
          where: { accountId: eventBody.installation.id.toString() },
          include: { workspace: true, integrationDefinition: true },
        },
      );
      if (!integrationAccount) {
        return undefined;
      }
      switch (eventType) {
        case 'issues':
          this.handleIssues(eventBody, integrationAccount);
          break;

        case 'issue_comment':
          this.handleIssueComments(eventBody, integrationAccount);
          break;

        case 'pull_request':
          this.handlePullRequests(eventBody, integrationAccount);
          break;

        case 'installation':
          this.handleInstallations(eventBody, integrationAccount);
          break;

        case 'installation_repositories':
          this.handleRepositories(eventBody, integrationAccount);
          break;

        default:
          console.warn(`couldn't find eventType ${eventType}`);
      }
    }
    return { status: 200, message: 'handled event successfully' };
  }

  /**
   * Handle changes in GitHub App installation
   * @param eventBody - The webhook event body
   * @param integrationAccount - The integration account with relations
   * @returns The updated integration account, or undefined if no action was taken
   */
  async handleInstallations(
    eventBody: EventBody,
    integrationAccount: IntegrationAccountWithRelations,
  ) {
    this.logger.debug(`Changes in App installation ${eventBody.action}`);

    // Skip handling for "installed" action
    if (eventBody.action === 'created') {
      this.logger.debug('Skipping handling for "installed" action');
      return undefined;
    }

    // Prepare update data based on the event action
    const updateData: Prisma.IntegrationAccountUpdateInput = {
      isActive: eventBody.action === 'unsuspend',
      ...(eventBody.action === 'deleted' && { deleted: new Date() }),
    };

    this.logger.debug(
      `Updating integration account ${integrationAccount.id} with data:`,
      updateData,
    );

    // Update the integration account with the prepared data
    return this.prisma.integrationAccount.update({
      where: { id: integrationAccount.id },
      data: updateData,
    });
  }

  /**
   * Handle GitHub issue events
   * @param eventBody - The webhook event body
   * @param integrationAccount - The integration account with relations
   * @returns The updated or created issue, or undefined if no action was taken
   */
  async handleIssues(
    eventBody: EventBody,
    integrationAccount: IntegrationAccountWithRelations,
  ): Promise<IssueWithRelations> {
    const accountSettings = integrationAccount.settings as Settings;
    // Get the team ID for the repository
    const teamId = getTeamId(
      eventBody.repository.id.toString(),
      accountSettings,
    );

    if (!teamId) {
      this.logger.log(
        `No teamId found for repository ${eventBody.repository.id}`,
      );
      return undefined;
    }

    const { action, issue, assignee } = eventBody;
    // Get the linked issue by the GitHub issue ID
    const linkedIssue = await this.linkedIssueService.getLinkedIssueBySourceId(
      issue.id.toString(),
    );

    // If no linked issue exists and the action is not 'opened', return undefined
    if (!linkedIssue?.issueId && action !== 'opened') {
      this.logger.log(`No linked issue found for GitHub issue ${issue.id}`);
      return undefined;
    }

    // Get the issue data for the event
    const issueData = await getIssueData(
      this.prisma,
      eventBody,
      integrationAccount,
      teamId,
    );

    let updateIssueData: UpdateIssueInput;
    switch (action) {
      case 'opened': {
        this.logger.log(`Creating new issue for GitHub issue ${issue.id}`);
        // Create a new issue
        const createdIssue = await this.issuesService.createIssueAPI(
          { teamId } as TeamRequestParams,
          issueData.issueInput as CreateIssueInput,
          issueData.userId,
          issueData.linkIssueData,
          issueData.sourceMetadata,
        );

        // Send the first comment for the new issue
        await sendGithubFirstComment(
          this.prisma,
          this.logger,
          this.linkedIssueService,
          integrationAccount,
          createdIssue,
          issue.id,
        );
        return createdIssue;
      }

      case 'edited':
      case 'reopened':
      case 'closed':
        this.logger.log(
          `Updating issue for GitHub issue ${issue.id} with action ${action}`,
        );
        // Merge existing and new subscriber IDs
        const existingSubscriberIds = new Set(linkedIssue.issue.subscriberIds);
        const newSubscriberIds = new Set(
          issueData.issueInput.subscriberIds || [],
        );
        const subscriberIds = [
          ...new Set([...existingSubscriberIds, ...newSubscriberIds]),
        ];
        updateIssueData = { ...issueData.issueInput, subscriberIds };

        break;

      case 'labeled':
      case 'unlabeled': {
        this.logger.log(
          `Updating labels for GitHub issue ${issue.id} with action ${action}`,
        );
        // Get or create label IDs for the issue
        const labelIds = await getOrCreateLabelIds(
          this.prisma,
          issue.labels,
          teamId,
          integrationAccount.workspaceId,
        );
        updateIssueData = { labelIds, ...issueData.issueInput };

        break;
      }

      case 'assigned':
      case 'unassigned': {
        this.logger.log(
          `Updating assignee for GitHub issue ${issue.id} with action ${action}`,
        );
        // Get the assignee ID if the issue is being assigned, otherwise set to null
        const assigneeId =
          action === 'assigned' ? await getUserId(this.prisma, assignee) : null;

        updateIssueData =
          action === 'assigned'
            ? ({
                assigneeId,
                subscriberIds: [...linkedIssue.issue.subscriberIds, assigneeId],
              } as UpdateIssueInput)
            : ({ assigneeId } as UpdateIssueInput);

        break;
      }

      default:
        this.logger.debug(`Unhandled GitHub issue action: ${action}`);
        return undefined;
    }

    if (updateIssueData) {
      this.logger.log(
        `Updating issue ${linkedIssue.issueId} for GitHub issue ${issue.id}`,
      );
      // Update the issue with the new data
      return this.issuesService.updateIssueApi(
        { teamId } as TeamRequestParams,
        updateIssueData,
        { issueId: linkedIssue.issueId } as IssueRequestParams,
        issueData.userId,
        issueData.linkIssueData,
        issueData.sourceMetadata,
      );
    }
    return undefined;
  }

  /**
   * Handle GitHub issue comment events
   * @param eventBody - The webhook event body
   * @param integrationAccount - The integration account with relations
   * @returns The updated or created issue, or undefined if no action was taken
   */
  async handleIssueComments(
    eventBody: EventBody,
    integrationAccount: IntegrationAccountWithRelations,
  ) {
    // Get the linked issue by the GitHub issue ID
    const linkedIssue = await this.linkedIssueService.getLinkedIssueBySourceId(
      eventBody.issue.id.toString(),
    );
    if (!linkedIssue) {
      this.logger.debug(
        `No linked issue found for GitHub issue ID: ${eventBody.issue.id}`,
      );
      return undefined;
    }

    const { issueId, source: linkedIssueSource } = linkedIssue;
    // Finding parent id from issue synced comment
    const parentId = (linkedIssueSource as Record<string, string>)
      .syncedCommentId;
    const userId = await getUserId(this.prisma, eventBody.sender);

    // Find the linked comment by the GitHub comment ID
    const linkedComment = await this.prisma.linkedComment.findFirst({
      where: { sourceId: eventBody.comment.id.toString() },
      include: { comment: true },
    });

    switch (eventBody.action) {
      case 'created':
        if (linkedComment) {
          this.logger.debug(
            `Linked comment already exists for GitHub comment ID: ${eventBody.comment.id}`,
          );
          return linkedComment.comment;
        }
        this.logger.log(
          `Creating new linked comment for GitHub comment ID: ${eventBody.comment.id}`,
        );
        // Create a new issue comment and link it to the GitHub comment
        const issueComment = await this.prisma.issueComment.create({
          data: {
            body: convertMarkdownToTiptapJson(eventBody.comment.body),
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
          include: { issue: { include: { team: true } } },
        });

        // Create a notification for the new comment
        await this.notificationsService.createNotification(
          NotificationEventFrom.NewComment,
          userId,
          {
            subscriberIds: issueComment.issue.subscriberIds,
            issueCommentId: issueComment.id,
            issueId: issueComment.issueId,
            workspaceId: issueComment.issue.team.workspaceId,
          },
        );
        return issueComment;

      case 'edited':
        if (linkedComment) {
          this.logger.log(
            `Updating linked comment for GitHub comment ID: ${eventBody.comment.id}`,
          );
          // Update the issue comment and linked comment data
          return await this.prisma.issueComment.update({
            where: { id: linkedComment.commentId },
            data: {
              body: convertMarkdownToTiptapJson(eventBody.comment.body),
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
        this.logger.debug(
          `No linked comment found to update for GitHub comment ID: ${eventBody.comment.id}`,
        );
        return undefined;

      case 'deleted':
        if (linkedComment) {
          this.logger.log(
            `Marking linked comment as deleted for GitHub comment ID: ${eventBody.comment.id}`,
          );
          const now = new Date().toISOString();
          // Mark the issue comment and linked comment as deleted
          return await this.prisma.issueComment.update({
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
        this.logger.debug(
          `No linked comment found to delete for GitHub comment ID: ${eventBody.comment.id}`,
        );
        return undefined;

      default:
        this.logger.debug(
          `Unsupported Issue Comment action: ${eventBody.action}`,
        );
        return undefined;
    }
  }

  /**
   * Handle GitHub pull requests events
   * @param eventBody - The webhook event body
   * @param integrationAccount - The integration account with relations
   * @returns The updated or created linked issue, or undefined if no action was taken
   */
  async handlePullRequests(
    eventBody: EventBody,
    integrationAccount: IntegrationAccountWithRelations,
  ): Promise<LinkedIssue | undefined> {
    const { pull_request: pullRequest, action, sender } = eventBody;
    const branchName = pullRequest.head.ref;
    const branchNameRegex = /^([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)-(\d+)$/;
    // Checking branch name is matching with regex
    const match = branchName.match(branchNameRegex);

    this.logger.debug(
      `Handling pull request event: action=${action}, branchName=${branchName}`,
    );

    if (!match) {
      this.logger.debug(
        `Branch name ${branchName} does not match the expected format`,
      );
      return undefined;
    }

    // Extracting username, team name and issue number from the regex match
    const [, userName, teamSlug, issueNumber] = match;

    this.logger.debug(
      `Extracted from branch name: userName=${userName}, teamSlug=${teamSlug}, issueNumber=${issueNumber}`,
    );

    // Getting user and team models using names of team and users
    const [user, team] = await Promise.all([
      this.prisma.user.findFirst({
        where: { username: { equals: userName, mode: 'insensitive' } },
      }),
      this.prisma.team.findFirst({
        where: { identifier: { equals: teamSlug, mode: 'insensitive' } },
      }),
    ]);

    // Getting issue object from the matched issue number
    const issue = await this.prisma.issue.findFirst({
      where: { number: Number(issueNumber), teamId: team.id },
    });

    if (!user || !team || !issue) {
      this.logger.debug(
        `User, team, or issue not found: user=${user}, team=${team}, issue=${issue}`,
      );
      return undefined;
    }

    const pullRequestId = pullRequest.id.toString();
    // Preparing source data for linked issue
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

    this.logger.log(`Pull request data: pullRequestId=${pullRequestId}}`);

    switch (action) {
      case 'opened': {
        // On opening a PR, it's creating a link to the issue
        const linkedIssue = await this.linkedIssueService.createLinkIssueAPI({
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

        this.logger.log(`Created linked issue: linkedIssue=${linkedIssue.id}`);

        // Sending linked message to the PR
        await sendGithubPRFirstComment(
          this.prisma,
          integrationAccount,
          team,
          issue,
          pullRequest.comments_url,
        );

        return linkedIssue;
      }

      case 'closed': {
        /** On closed, checking for all linked PR's, only updating status of ticket
         * when all other linked PR's are closed or only one linked PR
         * */
        const linkedIssues = await this.prisma.linkedIssue.findMany({
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

        this.logger.log(
          `Found ${openPRs.length} open pull requests for issue ${issue.id}`,
        );
        // Checking if the PR id exists in linkedIssues
        if (linkedIssueMap.has(pullRequestId)) {
          const linkedIssueId = linkedIssueMap.get(pullRequestId)!;
          const linkedIssue = await this.prisma.linkedIssue.update({
            where: { id: linkedIssueId },
            data: { sourceData },
          });

          this.logger.log(
            `Updated linked issue: linkedIssue=${linkedIssue.id}`,
          );

          // Updating ticket state to closed when only one PR left
          if (openPRs.length <= 1 && sourceData.mergedAt) {
            const stateId = await getState(this.prisma, 'closed', team.id);
            if (stateId) {
              await this.issuesService.updateIssue(
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
              this.logger.log(
                `Updated issue state to closed: issueId=${linkedIssue.issueId}`,
              );
            }
          }

          return linkedIssue;
        }

        this.logger.debug(
          `No matching linked issue found for pull request ${pullRequestId}`,
        );
        return undefined;
      }

      default:
        this.logger.debug(`Unhandled pull request action: ${action}`);
        return undefined;
    }
  }

  /**
   * Handle GitHub repository events
   * @param eventBody - The webhook event body
   * @param integrationAccount - The integration account with relations
   * @returns The updated integration account, or undefined if no action was taken
   */
  async handleRepositories(
    eventBody: EventBody,
    integrationAccount: IntegrationAccountWithRelations,
  ) {
    const integrationAccountSettings = integrationAccount.settings as Settings;

    // Get the repositories based on the event action (added or removed)
    const repositories =
      eventBody.action === 'added'
        ? eventBody.repositories_added
        : eventBody.repositories_removed;

    this.logger.log(
      `Handling ${eventBody.action} repositories event for IntegrationAccount ${integrationAccount.id}`,
    );
    this.logger.debug(`Repositories: ${JSON.stringify(repositories)}`);

    // Get the current repositories from the integration account settings
    const currentRepositories = integrationAccountSettings.Github.repositories;

    // Create a map of the current repositories for easier lookup
    const repoMap = new Map(
      currentRepositories.map((repo) => [repo.id.toString(), repo]),
    );

    switch (eventBody.action) {
      case 'added':
        // Add the new repositories to the repoMap
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        repositories.forEach((repo: any) => {
          repoMap.set(repo.id.toString(), {
            id: repo.id.toString(),
            fullName: repo.full_name,
            name: repo.name,
            private: repo.private,
          });
        });
        this.logger.debug(`Added repositories to repoMap`);
        break;
      case 'removed':
        // Remove the repositories from the repoMap
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        repositories.forEach((repo: any) => {
          repoMap.delete(repo.id.toString());
        });
        this.logger.debug(`Removed repositories from repoMap`);
        break;

      default:
        this.logger.debug(`Unsupported action: ${eventBody.action}`);
        return undefined;
    }

    // Update the integration account settings with the new repositories
    integrationAccountSettings.Github.repositories = Array.from(
      repoMap.values(),
    );

    this.logger.log(
      `Updating integration account ${integrationAccount.id} settings with repositories`,
    );

    // Update the integration account in the database with the new settings
    return await this.prisma.integrationAccount.update({
      where: { id: integrationAccount.id },
      data: {
        settings: integrationAccountSettings as Prisma.JsonObject,
      },
    });
  }
}
