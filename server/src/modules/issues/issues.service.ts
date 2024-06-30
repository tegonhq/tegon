/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable, Logger } from '@nestjs/common';
import { Issue, WorkflowCategory } from '@prisma/client';
import { createObjectCsvStringifier } from 'csv-writer';
import { PrismaService } from 'nestjs-prisma';
import OpenAI from 'openai';

import { convertTiptapJsonToText } from 'common/utils/tiptap.utils';

import { IssueHistoryData } from 'modules/issue-history/issue-history.interface';
import IssuesHistoryService from 'modules/issue-history/issue-history.service';
import {
  IssueRelationInput,
  IssueRelationType,
} from 'modules/issue-relation/issue-relation.interface';
import IssueRelationService from 'modules/issue-relation/issue-relation.service';
import {
  LinkIssueData,
  LinkedIssueSubType,
} from 'modules/linked-issue/linked-issue.interface';
import { getLinkType } from 'modules/linked-issue/linked-issue.utils';
import { NotificationEventFrom } from 'modules/notifications/notifications.interface';
import { NotificationsQueue } from 'modules/notifications/notifications.queue';
import { VectorService } from 'modules/vector/vector.service';

import {
  ApiResponse,
  CreateIssueInput,
  IssueAction,
  IssueRequestParams,
  IssueWithRelations,
  RelationInput,
  SubscribeType,
  SuggestionsInput,
  TeamRequestParams,
  UpdateIssueInput,
  WorkspaceQueryParams,
} from './issues.interface';
import { IssuesQueue } from './issues.queue';
import {
  findExistingLink,
  getEquivalentStateIds,
  getIssueDiff,
  getIssueTitle,
  getLastIssueNumber,
  getSubscriberIds,
  getSuggestedLabels,
  getSummary,
} from './issues.utils';

const openaiClient = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

@Injectable()
export default class IssuesService {
  private readonly logger: Logger = new Logger('IssueService');

  constructor(
    private prisma: PrismaService,
    private issueHistoryService: IssuesHistoryService,
    private issuesQueue: IssuesQueue,
    private issueRelationService: IssueRelationService,
    private notificationsQueue: NotificationsQueue,
    private vectorService: VectorService,
  ) {}

  /**
   * Creates a new issue with the provided data and performs related operations.
   * @param teamRequestParams The team request parameters.
   * @param issueData The data for creating the issue.
   * @param userId The ID of the user creating the issue (optional).
   * @param linkIssuedata The data for linking the issue (optional).
   * @param linkMetaData Additional metadata for linking the issue (optional).
   * @returns The created issue or an API response if there was an error.
   */
  async createIssue(
    teamRequestParams: TeamRequestParams,
    issueData: CreateIssueInput,
    userId?: string,
    linkIssuedata?: LinkIssueData,
    linkMetaData?: Record<string, string>,
  ): Promise<ApiResponse | Issue> {
    // Destructure linkIssue from issueData and assign remaining properties to otherIssueData
    const { linkIssue, ...otherIssueData } = issueData;

    this.logger.debug(
      `Creating issue with data: ${JSON.stringify(otherIssueData)}`,
    );

    // Check if a link issue exists and find its status
    const linkStatus = linkIssue
      ? await findExistingLink(this.prisma, linkIssue)
      : null;
    if (linkStatus?.status === 400) {
      // Log an error if there was a problem finding the existing link
      this.logger.error(
        `Error finding existing link: ${JSON.stringify(linkStatus)}`,
      );
      return linkStatus;
    }

    // Create the issue using the API method
    const issue = await this.createIssueAPI(
      teamRequestParams,
      otherIssueData,
      userId,
      linkIssuedata,
      linkMetaData,
    );

    this.logger.log(`Created issue: ${issue.number}`);

    if (linkIssue) {
      // Set the link issue type based on the URL
      linkIssue.type = getLinkType(linkIssue.url) as LinkedIssueSubType;
      this.logger.log(
        `Adding create link issue job for link: ${linkIssue.url}`,
      );
      // Add a create link issue job to the issues queue
      this.issuesQueue.addCreateLinkIssueJob(
        teamRequestParams,
        linkIssue,
        { issueId: issue.id },
        userId,
      );
    } else if (otherIssueData.isBidirectional) {
      this.logger.log(`Adding two-way sync job for issue: ${issue.id}`);
      // Add a two-way sync job to the issues queue
      this.issuesQueue.addTwoWaySyncJob(issue, IssueAction.CREATED, userId);
    }

    return issue;
  }

  /**
   * Creates a new issue using the provided issue data and performs related operations.
   * @param teamRequestParams The team request parameters.
   * @param issueData The data for creating the issue.
   * @param userId The ID of the user creating the issue (optional).
   * @param linkIssuedata The data for linking the issue (optional).
   * @param linkMetaData Additional metadata for linking the issue (optional).
   * @returns The created issue with its relations.
   */
  async createIssueAPI(
    teamRequestParams: TeamRequestParams,
    issueData: CreateIssueInput,
    userId?: string,
    linkIssuedata?: LinkIssueData,
    linkMetaData?: Record<string, string>,
  ): Promise<IssueWithRelations> {
    // Destructure issueData to separate parentId, issueRelation, and other issue data
    const { parentId, issueRelation, ...otherIssueData } = issueData;

    // Get the last issue number for the team
    const lastNumber = await getLastIssueNumber(
      this.prisma,
      teamRequestParams.teamId,
    );

    // Generate the issue title using OpenAI
    const issueTitle = await getIssueTitle(openaiClient, issueData);

    // Get the subscriber IDs based on the provided user, assignee, and subscription type
    const subscriberIds = getSubscriberIds(
      userId,
      issueData.assigneeId,
      null,
      SubscribeType.SUBSCRIBE,
    );

    // Create the issue in the database with the provided data
    const issue = await this.prisma.issue.create({
      data: {
        title: issueTitle,
        number: lastNumber + 1,
        team: { connect: { id: teamRequestParams.teamId } },
        subscriberIds,
        ...otherIssueData,
        ...(userId && { createdBy: { connect: { id: userId } } }),
        ...(parentId && { parent: { connect: { id: parentId } } }),
        ...(linkIssuedata && {
          linkedIssue: { create: linkIssuedata },
        }),
        ...(linkMetaData && { sourceMetadata: linkMetaData }),
      },
      include: {
        team: true,
      },
    });

    // Upsert the issue history with the issue diff and other metadata
    await this.upsertIssueHistory(
      issue,
      await getIssueDiff(issue, null),
      userId,
      linkMetaData,
      issueRelation,
    );

    // Add the issue to the notification queue if there are subscribers
    if (issue.subscriberIds) {
      this.notificationsQueue.addToNotification(
        NotificationEventFrom.IssueCreated,
        issue.createdById,
        {
          issueId: issue.id,
          subscriberIds: issue.subscriberIds,
          toStateId: issue.stateId,
          toPriority: issue.priority,
          toAssigneeId: issue.assigneeId,
          sourceMetadata: linkMetaData,
          workspaceId: issue.team.workspaceId,
        },
      );
    }

    // Add the issue to the vector service for similarity search
    this.issuesQueue.addIssueToVector(issue);

    // Check if the issue state is in the triage category and handle it accordingly
    const issueState = await this.prisma.workflow.findUnique({
      where: { id: issue.stateId },
    });
    if (issueState.category === WorkflowCategory.TRIAGE) {
      this.issuesQueue.handleTriageIssue(issue, false);
    }

    return issue;
  }

  /**
   * Updates an existing issue with the provided data and performs related operations.
   * @param teamRequestParams The team request parameters.
   * @param issueData The data for updating the issue.
   * @param issueParams The parameters for identifying the issue to update.
   * @param userId The ID of the user updating the issue (optional).
   * @param linkIssuedata The data for linking the issue (optional).
   * @param linkMetaData Additional metadata for linking the issue (optional).
   * @returns The updated issue.
   */
  async updateIssue(
    teamRequestParams: TeamRequestParams,
    issueData: UpdateIssueInput,
    issueParams: IssueRequestParams,
    userId?: string,
    linkIssuedata?: LinkIssueData,
    linkMetaData?: Record<string, string>,
  ): Promise<Issue> {
    this.logger.log(`Updating issue with ID: ${issueParams.issueId}`);

    // Call the updateIssueApi method to update the issue
    const updatedIssue = await this.updateIssueApi(
      teamRequestParams,
      issueData,
      issueParams,
      userId,
      linkIssuedata,
      linkMetaData,
    );

    // Check if the updated issue is bidirectional
    if (updatedIssue.isBidirectional) {
      this.logger.log(`Adding two-way sync job for issue: ${updatedIssue.id}`);
      // Add a two-way sync job to the issues queue for the updated issue
      this.issuesQueue.addTwoWaySyncJob(
        updatedIssue,
        IssueAction.UPDATED,
        userId,
      );
    }

    return updatedIssue;
  }

  /**
   * Updates an issue using the API.
   * @param teamRequestParams The team request parameters.
   * @param issueData The updated issue data.
   * @param issueParams The issue request parameters.
   * @param userId The ID of the user updating the issue.
   * @param linkIssuedata The linked issue data.
   * @param linkMetaData The link metadata.
   * @returns The updated issue.
   */
  async updateIssueApi(
    teamRequestParams: TeamRequestParams,
    issueData: UpdateIssueInput,
    issueParams: IssueRequestParams,
    userId?: string,
    linkIssuedata?: LinkIssueData,
    linkMetaData?: Record<string, string>,
  ) {
    // Destructure the issue data
    const {
      parentId,
      issueRelation,
      subscriberIds = null,
      ...otherIssueData
    } = issueData;

    // Find the current issue
    const currentIssue = await this.prisma.issue.findUnique({
      where: { id: issueParams.issueId },
    });

    // Prepare the updated issue data
    const updatedIssueData = {
      subscriberIds: getSubscriberIds(
        userId,
        issueData.assigneeId,
        [...new Set([...currentIssue.subscriberIds, ...(subscriberIds || [])])],
        SubscribeType.SUBSCRIBE,
      ),
      ...otherIssueData,
      ...(parentId ? { parent: { connect: { id: parentId } } } : { parentId }),
      ...(linkIssuedata && {
        linkedIssue: {
          upsert: {
            where: { url: linkIssuedata.url },
            update: { sourceData: linkIssuedata.sourceData },
            create: linkIssuedata,
          },
        },
      }),
    };

    // Update the issue in the database
    const updatedIssue = await this.prisma.issue.update({
      where: {
        id: issueParams.issueId,
        teamId: teamRequestParams.teamId,
      },
      data: updatedIssueData,
      include: {
        team: true,
      },
    });

    this.logger.log(
      `Issue with ID ${issueParams.issueId} updated successfully`,
    );

    // Get the difference between the updated and current issue
    const issueDiff = await getIssueDiff(updatedIssue, currentIssue);

    // Upsert the issue history
    this.upsertIssueHistory(
      updatedIssue,
      issueDiff,
      userId,
      linkMetaData,
      issueRelation,
    );

    // Add the updated issue to the notifications queue if it has subscribers
    if (updatedIssue.subscriberIds) {
      this.notificationsQueue.addToNotification(
        NotificationEventFrom.IssueUpdated,
        userId,
        {
          issueId: updatedIssue.id,
          ...issueDiff,
          sourceMetadata: linkMetaData,
          subscriberIds: updatedIssue.subscriberIds,
          workspaceId: updatedIssue.team.workspaceId,
        },
      );
    }

    // Add the updated issue to the vector
    this.issuesQueue.addIssueToVector(updatedIssue);

    // Find the current and updated issue states
    const [currentIssueState, updatedIssueState] = await Promise.all([
      this.prisma.workflow.findUnique({ where: { id: currentIssue.stateId } }),
      this.prisma.workflow.findUnique({ where: { id: updatedIssue.stateId } }),
    ]);

    // Handle triage issues if the current or updated issue state is in the triage category
    if (
      [currentIssueState.category, updatedIssueState.category].includes(
        WorkflowCategory.TRIAGE,
      )
    ) {
      const isDeleted = updatedIssueState.category !== WorkflowCategory.TRIAGE;
      this.issuesQueue.handleTriageIssue(
        isDeleted ? currentIssue : updatedIssue,
        isDeleted,
      );
    }

    return updatedIssue;
  }

  /**
   * Deletes an issue based on the provided team request parameters and issue parameters.
   * @param teamRequestParams The team request parameters.
   * @param issueParams The issue request parameters.
   * @returns The deleted issue.
   */
  async deleteIssue(
    teamRequestParams: TeamRequestParams,
    issueParams: IssueRequestParams,
  ): Promise<Issue> {
    this.logger.log(
      `Deleting issue with id ${issueParams.issueId} for team ${teamRequestParams.teamId}`,
    );

    // Update the issue in the database by marking it as deleted with the current timestamp
    const deleteIssue = await this.prisma.issue.update({
      where: {
        id: issueParams.issueId,
        teamId: teamRequestParams.teamId,
      },
      data: {
        deleted: new Date().toISOString(),
      },
    });

    await this.prisma.issue.updateMany({
      where: {
        parentId: deleteIssue.id,
      },
      data: {
        parentId: null,
      },
    });

    this.logger.log(`Issue ${deleteIssue.id} marked as deleted`);

    // Delete the issue history associated with the deleted issue
    await this.deleteIssueHistory(deleteIssue.id);
    await this.notificationsQueue.deleteNotificationsByIssue(deleteIssue.id);

    this.logger.log(`Issue history deleted for issue ${deleteIssue.id}`);

    return deleteIssue;
  }

  /**
   * Upserts the issue history and creates an issue relation if provided.
   * @param issue The issue object.
   * @param issueDiff The issue history data.
   * @param userId The ID of the user performing the action (optional).
   * @param linkMetaData Additional metadata for linking the issue (optional).
   * @param issueRelation The issue relation input (optional).
   */
  private async upsertIssueHistory(
    issue: Issue,
    issueDiff: IssueHistoryData,
    userId?: string,
    linkMetaData?: Record<string, string>,
    issueRelation?: RelationInput,
  ): Promise<void> {
    this.logger.log(`Upserting issue history for issue ${issue.id}`);

    // Upsert the issue history using the issueHistoryService
    await this.issueHistoryService.upsertIssueHistory(
      userId,
      issue.id,
      issueDiff,
      linkMetaData,
    );

    // Check if an issue relation is provided
    if (issueRelation) {
      this.logger.log(`Creating issue relation for issue ${issue.id}`);

      // Create the issue relation input object
      const relationInput: IssueRelationInput = {
        issueId: issueRelation.issueId || issue.id,
        relatedIssueId: issueRelation.relatedIssueId || issue.id,
        type: issueRelation.type,
      };

      // Create the issue relation using the issueRelationService
      await this.issueRelationService.createIssueRelation(
        userId,
        relationInput,
      );
    }
  }

  /**
   * Deletes the issue history for a given issue ID.
   * @param issueId The ID of the issue.
   */
  private async deleteIssueHistory(issueId: string): Promise<void> {
    this.logger.log(`Deleting issue history for issue ${issueId}`);

    // Call the issueHistoryService to delete the issue history
    await this.issueHistoryService.deleteIssueHistory(issueId);
  }

  /**
   * Handles the subscription of a user to an issue.
   * @param userId The ID of the user subscribing/unsubscribing.
   * @param issueId The ID of the issue.
   * @param type The type of subscription action (subscribe or unsubscribe).
   * @returns The updated issue with the modified subscriber IDs.
   */
  async handleSubscription(
    userId: string,
    issueId: string,
    type: SubscribeType,
  ) {
    // Find the issue by its ID
    const issue = await this.prisma.issue.findUnique({
      where: { id: issueId },
    });

    // Get the updated subscriber IDs based on the subscription action
    const subscriberIds = getSubscriberIds(
      userId,
      null,
      issue.subscriberIds,
      type,
    );

    // Update the issue with the new subscriber IDs
    return await this.prisma.issue.update({
      where: { id: issueId },
      data: { subscriberIds },
    });
  }

  /**
   * Generates suggestions for labels and assignees based on the issue description.
   * @param teamRequestParams The team request parameters.
   * @param suggestionsInput The input for generating suggestions, including the issue description and workspace ID.
   * @returns An object containing the suggested labels and assignees.
   */
  async suggestions(
    teamRequestParams: TeamRequestParams,
    suggestionsInput: SuggestionsInput,
  ) {
    // Check if the description is empty or falsy
    if (!suggestionsInput.description) {
      return { labels: [], assignees: [] };
    }

    // Find labels based on the workspace ID and team ID
    const labels = await this.prisma.label.findMany({
      where: {
        OR: [
          { workspaceId: suggestionsInput.workspaceId },
          { teamId: teamRequestParams.teamId },
        ],
      },
    });

    // Get suggested labels and similar issues concurrently
    const [labelsSuggested, similarIssues] = await Promise.all([
      getSuggestedLabels(
        openaiClient,
        labels.map((label) => label.name),
        suggestionsInput.description,
      ),
      this.vectorService.searchEmbeddings(
        suggestionsInput.workspaceId,
        suggestionsInput.description,
        10,
        0.2,
      ),
    ]);

    // Find suggested labels based on the suggested label names
    const suggestedLabels = await this.prisma.label.findMany({
      where: {
        name: { in: labelsSuggested.split(/,\s*/), mode: 'insensitive' },
        OR: [
          { workspaceId: suggestionsInput.workspaceId },
          { teamId: teamRequestParams.teamId },
        ],
      },
      select: { id: true, name: true, color: true },
    });

    // Extract unique assignee IDs from similar issues
    const assigneeIds = new Set(
      similarIssues
        .filter((issue) => issue.assigneeId)
        .map((issue) => issue.assigneeId),
    );

    // Map assignee IDs to assignee objects with scores
    const assignees = Array.from(assigneeIds).map((assigneeId) => ({
      id: assigneeId,
      score: similarIssues.find((issue) => issue.assigneeId === assigneeId)
        .score,
    }));

    return { labels: suggestedLabels, assignees };
  }

  /**
   * Updates the subscribers of an issue by adding the provided subscriber IDs.
   * @param issueId The ID of the issue to update.
   * @param subscriberIds An array of subscriber IDs to add to the issue.
   * @returns The updated issue with the new subscriber IDs.
   */
  async updateSubscribers(issueId: string, subscriberIds: string[]) {
    return await this.prisma.issue.update({
      where: { id: issueId },
      data: {
        subscriberIds: {
          push: subscriberIds,
        },
      },
    });
  }

  /**
   * Exports issues for a given workspace to a CSV string.
   * @param workspaceParams The workspace query parameters.
   * @returns A Promise that resolves to the CSV string of exported issues.
   */
  async exportIssues(workspaceParams: WorkspaceQueryParams): Promise<string> {
    // Find all issues for the given workspace, including related data
    const issues = await this.prisma.issue.findMany({
      where: { team: { workspaceId: workspaceParams.workspaceId } },
      include: {
        createdBy: true,
        parent: true,
        team: true,
      },
    });

    // Get all unique label IDs from the issues and create a map of label ID to label
    const labelIds = [...new Set(issues.flatMap((issue) => issue.labelIds))];
    const labelMap =
      labelIds.length > 0
        ? new Map(
            await this.prisma.label
              .findMany({ where: { id: { in: labelIds } } })
              .then((labels) => labels.map((label) => [label.id, label])),
          )
        : new Map();

    // Get all unique assignee IDs from the issues and create a map of assignee ID to user
    const assigneeIds = issues
      .map((issue) => issue.assigneeId)
      .filter((id): id is string => id !== null && id !== undefined);
    const assigneeMap =
      assigneeIds.length > 0
        ? new Map(
            await this.prisma.user
              .findMany({
                where: { id: { in: assigneeIds } },
                select: { id: true, fullname: true, email: true },
              })
              .then((users) => users.map((user) => [user.id, user])),
          )
        : new Map();

    // Get all unique state IDs from the issues and create a map of state ID to workflow
    const stateIds = issues
      .map((issue) => issue.stateId)
      .filter((id): id is string => id !== null && id !== undefined);
    const stateMap =
      stateIds.length > 0
        ? new Map(
            await this.prisma.workflow
              .findMany({
                where: { id: { in: stateIds } },
                select: { id: true, name: true },
              })
              .then((workflows) =>
                workflows.map((workflow) => [workflow.id, workflow]),
              ),
          )
        : new Map();

    // Create a CSV stringifier with the specified header
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'number', title: 'Number' },
        { id: 'title', title: 'Title' },
        { id: 'description', title: 'Description' },
        { id: 'stateId', title: 'State' },
        { id: 'labels', title: 'Labels' },
        { id: 'priority', title: 'Priority' },
        { id: 'parentIssue', title: 'Parent Issue' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'updatedAt', title: 'Updated At' },
        { id: 'createdBy', title: 'Created By' },
        { id: 'team', title: 'Team' },
        { id: 'assignee', title: 'Assignee' },
      ],
    });

    // Map the issues to the CSV data format
    const csvData = issues.map((issue) => ({
      number: `${issue.team.identifier} - ${issue.number}`,
      title: issue.title,
      description: convertTiptapJsonToText(issue.description),
      stateId: stateMap.get(issue.stateId).name,
      priority: issue.priority,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
      createdBy: issue.createdBy ? `${issue.createdBy.fullname}` : '',
      labels: issue.labelIds
        .map((labelId) => labelMap.get(labelId)?.name || '')
        .filter(Boolean)
        .join(', '),
      parentIssue: issue.parent
        ? `${issue.team.identifier}-${issue.parent.number}`
        : null,
      team: issue.team.name,
      assignee: issue.assigneeId
        ? assigneeMap.get(issue.assigneeId)?.fullname || null
        : null,
    }));

    // Return the CSV string with the header and stringified records
    return (
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(csvData)
    );
  }

  async moveIssue(userId: string, issueId: string, teamId: string) {
    const currentIssue = await this.prisma.issue.findUnique({
      where: { id: issueId },
      include: { subIssue: true, team: true },
    });

    const workflowIds = await getEquivalentStateIds(
      this.prisma,
      currentIssue.teamId,
      teamId,
    );

    const workspaceLabelIds = await this.prisma.label
      .findMany({
        where: {
          AND: [
            { workspaceId: currentIssue.team.workspaceId },
            { teamId: null },
          ],
        },
        select: { id: true },
      })
      .then((labels) => labels.map((label) => label.id));

    const updatedLabelIds = currentIssue.labelIds.filter((labelId) =>
      workspaceLabelIds.includes(labelId),
    );

    const issueNumber = await getLastIssueNumber(this.prisma, teamId);

    const userOnWorkspace = currentIssue.assigneeId
      ? await this.prisma.usersOnWorkspaces.findUnique({
          where: {
            userId_workspaceId: {
              userId: currentIssue.assigneeId,
              workspaceId: currentIssue.team.workspaceId,
            },
          },
        })
      : null;

    const assigneeId = userOnWorkspace?.teamIds.includes(teamId)
      ? currentIssue.assigneeId
      : null;

    const updatedIssue = await this.prisma.issue.update({
      where: { id: issueId },
      data: {
        labelIds: updatedLabelIds,
        stateId: workflowIds[currentIssue.stateId],
        number: issueNumber + 1,
        teamId,
        assigneeId,
      },
    });

    this.issuesQueue.addIssueToVector(updatedIssue);

    if (currentIssue.subIssue.length > 0) {
      for (const subIssue of currentIssue.subIssue) {
        await this.moveIssue(userId, subIssue.id, teamId);
      }
    }

    const issueDiff = await getIssueDiff(updatedIssue, currentIssue);

    const removedLabelIds = issueDiff.removedLabelIds;
    issueDiff.removedLabelIds = [];

    await this.upsertIssueHistory(updatedIssue, issueDiff, userId);

    const issueHistories = await this.prisma.issueHistory.findMany({
      where: { issueId: updatedIssue.id },
      select: {
        id: true,
        addedLabelIds: true,
        removedLabelIds: true,
        fromStateId: true,
        toStateId: true,
      },
    });

    issueHistories.map(async (issueHistory) => {
      await this.prisma.issueHistory.update({
        where: { id: issueHistory.id },
        data: {
          addedLabelIds: issueHistory.addedLabelIds.filter(
            (labelId) => !removedLabelIds.includes(labelId),
          ),
          removedLabelIds: issueHistory.removedLabelIds.filter(
            (labelId) => !removedLabelIds.includes(labelId),
          ),

          fromStateId: workflowIds[issueHistory.fromStateId],
          toStateId: workflowIds[issueHistory.toStateId],
        },
      });
    });
    return updatedIssue;
  }

  /**
   * Generates issue suggestions for a given issue.
   * If the issue already has labels, returns undefined.
   * If similar issues exist, uses their label IDs for suggestions.
   * Otherwise, fetches suggested labels from OpenAI based on the issue description.
   * Upserts the issue suggestion with the suggested label IDs.
   * @param issue The issue to generate suggestions for.
   * @returns The upserted issue suggestion or undefined if the issue already has labels.
   */
  async issueSuggestions(issue: IssueWithRelations) {
    // If the issue already has labels, return undefined
    if (issue.labelIds.length >= 1) {
      this.logger.log(
        `Issue ${issue.id} already has labels, skipping suggestions.`,
      );
      return undefined;
    }

    // Fetch labels for the workspace or team, and similar issues
    const [labels, similarIssues] = await Promise.all([
      this.prisma.label.findMany({
        where: {
          OR: [
            { workspaceId: issue.team.workspaceId },
            { teamId: issue.teamId },
          ],
        },
      }),
      this.prisma.issueRelation.findMany({
        where: {
          relatedIssueId: issue.id,
          type: IssueRelationType.SIMILAR,
          deleted: null,
        },
        include: {
          issue: true,
        },
      }),
    ]);

    this.logger.log(
      `Fetched ${labels.length} labels and ${similarIssues.length} similar issues for issue ${issue.id}.`,
    );

    let labelIds: string[];

    // If similar issues exist, use their label IDs
    if (similarIssues.length > 0) {
      labelIds = similarIssues.flatMap(
        (similarIssue) => similarIssue.issue.labelIds,
      );
      this.logger.log(
        `Using label IDs from ${similarIssues.length} similar issues for issue ${issue.id}.`,
      );
    } else {
      // Otherwise, get suggested labels from OpenAI based on the issue description
      this.logger.log(
        `Fetching suggested labels from OpenAI for issue ${issue.id}.`,
      );
      const gptLabels = await getSuggestedLabels(
        openaiClient,
        labels.map((label) => label.name),
        issue.description,
      );

      // Find the suggested labels in the database
      const suggestedLabels = await this.prisma.label.findMany({
        where: {
          name: { in: gptLabels.split(/,\s*/), mode: 'insensitive' },
          OR: [
            { workspaceId: issue.team.workspaceId },
            { teamId: issue.teamId },
          ],
        },
        select: { id: true },
      });

      // Extract the label IDs from the suggested labels
      labelIds = suggestedLabels.map((label) => label.id);
    }

    // Upsert the issue suggestion with the suggested label IDs
    // If the issue suggestion exists, update it; otherwise, create a new one
    const suggestion = await this.prisma.issueSuggestion.upsert({
      where: { issueId: issue.id },
      create: {
        issueId: issue.id,
        issue: { connect: { id: issue.id } },
        suggestedLabelIds: [...new Set(labelIds)], // Use a Set to ensure unique label IDs
      },
      update: {
        suggestedLabelIds: [...new Set(labelIds)], // Use a Set to ensure unique label IDs
      },
    });

    this.logger.log(
      `Upserted issue suggestion for issue ${issue.id} with ${suggestion.suggestedLabelIds.length} suggested labels.`,
    );

    // Return the upserted issue suggestion
    return suggestion;
  }

  /**
   * Deletes an issue suggestion by marking it as deleted.
   * @param issueId The ID of the issue associated with the suggestion.
   * @returns The updated issue suggestion with the deleted timestamp.
   */
  async deleteIssueSuggestion(issueId: string) {
    return await this.prisma.issueSuggestion.update({
      where: { issueId },
      data: { deleted: new Date().toISOString() },
    });
  }

  /**
   * Generates similar issue suggestions for a given issue in a workspace.
   * @param workspaceId The ID of the workspace.
   * @param issueId The ID of the issue to find similar issues for.
   * @returns An array of similar issues.
   */
  async similarIssueSuggestion(workspaceId: string, issueId: string) {
    // Find similar issues using the vector service
    const similarIssues = await this.vectorService.similarIssues(
      workspaceId,
      issueId,
    );

    // Create issue relations for each similar issue
    similarIssues.map(async (similarIssue) => {
      const relationData: IssueRelationInput = {
        type: IssueRelationType.SIMILAR,
        issueId,
        relatedIssueId: similarIssue.id,
      };

      // Create the issue relation using the issue relation service
      await this.issueRelationService.createIssueRelation(null, relationData);
    });

    return similarIssues;
  }

  /**
   * Generates similar issue suggestions for a given issue in a workspace.
   * @param workspaceId The ID of the workspace.
   * @param issueId The ID of the issue to find similar issues for.
   * @returns An array of similar issues.
   */
  async summarizeIssue(issueId: string) {
    // Fetch issue comments and their replies for the given issueId
    const issueComments = await this.prisma.issueComment.findMany({
      where: { issueId, deleted: null, parentId: null },
      orderBy: { createdAt: 'asc' },
      include: {
        replies: {
          where: { deleted: null },
          orderBy: { createdAt: 'asc' },
        },
        issue: { include: { team: true } },
      },
    });

    // If no comments are found, return undefined
    if (issueComments.length < 1) {
      return undefined;
    }

    // Fetch team users for the workspace and team associated with the issue
    const teamUsers = await this.prisma.usersOnWorkspaces.findMany({
      where: {
        workspaceId: issueComments[0].issue.team.workspaceId,
        teamIds: {
          hasSome: [issueComments[0].issue.teamId],
        },
      },
      include: { user: true },
    });

    // Create a mapping of user IDs to their full names
    const formattedTeamUsers: Record<string, string> = teamUsers.reduce(
      (acc: Record<string, string>, member) => {
        acc[member.user.id] = member.user.fullname;
        return acc;
      },
      {},
    );

    // Format comments and replies with user names
    const formattedComments = issueComments.map((comment) => {
      const sourceMetadata = comment.sourceMetadata as Record<string, string>;
      const userName =
        formattedTeamUsers[comment.userId] ||
        sourceMetadata?.userDisplayName ||
        null;
      const message = convertTiptapJsonToText(comment.body);
      const formattedReplies = comment.replies.map((reply) => {
        const replySourceMetadata = reply.sourceMetadata as Record<
          string,
          string
        >;
        const replyUserName =
          formattedTeamUsers[comment.userId] ||
          replySourceMetadata?.userDisplayName ||
          null;
        const replyMessage = convertTiptapJsonToText(reply.body);
        return `  Reply - ${replyUserName}: ${replyMessage}`;
      });
      return `Message - ${userName}: ${message}\n${formattedReplies.join('\n')}`;
    });

    // Generate a summary of the formatted comments using OpenAI
    const rawSummary = await getSummary(
      openaiClient,
      formattedComments.join('\n'),
    );

    // Extract bullet points from the raw summary using regex
    const bulletPointRegex = /- (.*)/g;
    const bulletPoints =
      rawSummary
        .match(bulletPointRegex)
        ?.map((point) => point.replace(/^- /, '').trim()) || [];

    // Return the extracted bullet points
    return bulletPoints;
  }
}
