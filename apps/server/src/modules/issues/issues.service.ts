import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateIssueDto,
  CreateIssueRelationDto,
  CreateLinkedIssueDto,
  Issue,
  IssueRequestParamsDto,
  TeamRequestParamsDto,
  UpdateIssueDto,
  WorkflowCategoryEnum,
  WorkspaceRequestParamsDto,
  GetIssuesByFilterDTO,
} from '@tegonhq/types';
import { createObjectCsvStringifier } from 'csv-writer';
import { PrismaService } from 'nestjs-prisma';

import { convertTiptapJsonToText } from 'common/utils/tiptap.utils';

import AIRequestsService from 'modules/ai-requests/ai-requests.services';
import { IssueHistoryData } from 'modules/issue-history/issue-history.interface';
import IssuesHistoryService from 'modules/issue-history/issue-history.service';
import IssueRelationService from 'modules/issue-relation/issue-relation.service';
import { NotificationEventFrom } from 'modules/notifications/notifications.interface';
import { NotificationsQueue } from 'modules/notifications/notifications.queue';

import { SubscribeType } from './issues.interface';
import { IssuesQueue } from './issues.queue';
import {
  getCreateIssueInput,
  getEquivalentStateIds,
  getFilterWhere,
  getIssueDiff,
  getLastIssueNumber,
  getSubscriberIds,
  getWorkspace,
  handlePostCreateIssue,
} from './issues.utils';

@Injectable()
export default class IssuesService {
  private readonly logger: Logger = new Logger('IssueService');

  constructor(
    private prisma: PrismaService,
    private issueHistoryService: IssuesHistoryService,
    private issuesQueue: IssuesQueue,
    private issueRelationService: IssueRelationService,
    private notificationsQueue: NotificationsQueue,
    private aiRequestsService: AIRequestsService,
  ) {}

  async getIssueById(issueParams: IssueRequestParamsDto): Promise<Issue> {
    return this.prisma.issue.findUnique({
      where: { id: issueParams.issueId },
      include: {
        team: true,
      },
    });
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
    issueData: CreateIssueDto,
    userId: string,
  ): Promise<Issue> {
    // Destructure issueData to separate parentId, subIssues, issueRelation, teamId, and other issue data
    const { issueRelation, teamId, linkIssueData, sourceMetadata } = issueData;

    // Fetch the workspace associated with the team
    const workspace = await getWorkspace(this.prisma, teamId);

    const createdByInfo = {
      updatedById: userId,
      createdById: userId,
    };

    // Create the issues in the database within a transaction
    const issues = await this.prisma.$transaction(async (prisma) => {
      // Get the last issue number for the team
      let lastNumber = await getLastIssueNumber(this.prisma, teamId);

      // Helper function to create an issue
      const createIssue = async (
        data: Prisma.IssueCreateInput,
      ): Promise<Issue> => {
        lastNumber++;
        return prisma.issue.create({
          data: {
            ...data,
            ...createdByInfo,
            title: data.title,
            number: lastNumber,
            team: { connect: { id: issueData.teamId } },
            ...(linkIssueData && {
              linkedIssue: {
                create: { ...linkIssueData, ...createdByInfo },
              },
            }),
            ...(sourceMetadata && { sourceMetadata }),
          },
          include: { team: true },
        });
      };

      // Create one list with both issue data and respective subissues
      const createIssuesData = [issueData, ...(issueData.subIssues ?? [])];
      const createdIssues: Issue[] = [];
      let mainIssueId: string;

      // Create issues recursively
      for (const issueData of createIssuesData) {
        const { parentId, ...otherData } = issueData;
        const issueInput = await getCreateIssueInput(
          this.prisma,
          this.aiRequestsService,
          {
            ...otherData,

            ...(parentId ? { parentId } : { parentId: mainIssueId }),
          },
          workspace.id,
          userId,
        );

        createdIssues.push(await createIssue(issueInput));
        // Assign first issue Id as parent id for rest of the issues
        if (createdIssues.length === 1) {
          mainIssueId = createdIssues[0].id;
        }
      }

      return createdIssues;
    });

    // Process each created issue
    await Promise.all(
      issues.map(async (issue: Issue) => {
        // Upsert the issue history with the issue diff and other metadata
        this.upsertIssueHistory(
          issue,
          await getIssueDiff(issue, null),
          userId,
          sourceMetadata,
          issueRelation,
        );

        handlePostCreateIssue(
          this.prisma,
          this.notificationsQueue,
          this.issuesQueue,
          issue,
          sourceMetadata,
        );
      }),
    );

    // Return the main created issue
    return issues[0];
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
    teamRequestParams: TeamRequestParamsDto,
    issueData: UpdateIssueDto,
    issueParams: IssueRequestParamsDto,
    userId: string,
    linkIssuedata?: CreateLinkedIssueDto,
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

    const updatedIssueInfo = {
      updatedById: userId,
    };

    // Prepare the updated issue data
    const updatedIssueData = {
      subscriberIds: getSubscriberIds(
        userId,
        issueData.assigneeId,
        [...new Set([...currentIssue.subscriberIds, ...(subscriberIds || [])])],
        SubscribeType.SUBSCRIBE,
      ),
      updatedById: userId,
      ...otherIssueData,
      ...(parentId ? { parent: { connect: { id: parentId } } } : { parentId }),
      ...(linkIssuedata && {
        linkedIssue: {
          upsert: {
            where: { url: linkIssuedata.url },
            update: {
              sourceData: linkIssuedata.sourceData,
              ...updatedIssueInfo,
            },
            create: {
              ...linkIssuedata,
              ...updatedIssueInfo,
              createdById: userId,
            },
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

    // this.issuesQueue.addIssueToVector(updatedIssue);

    // Find the current and updated issue states
    const [currentIssueState, updatedIssueState] = await Promise.all([
      this.prisma.workflow.findUnique({ where: { id: currentIssue.stateId } }),
      this.prisma.workflow.findUnique({ where: { id: updatedIssue.stateId } }),
    ]);

    // Handle triage issues if the current or updated issue state is in the triage category
    if (
      [currentIssueState.category, updatedIssueState.category].includes(
        WorkflowCategoryEnum.TRIAGE,
      )
    ) {
      const isDeleted =
        updatedIssueState.category !== WorkflowCategoryEnum.TRIAGE;
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
    teamRequestParams: TeamRequestParamsDto,
    issueParams: IssueRequestParamsDto,
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
    issueRelation?: CreateIssueRelationDto,
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
      const relationInput: CreateIssueRelationDto = {
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
          set: subscriberIds,
        },
      },
    });
  }

  /**
   * Exports issues for a given workspace to a CSV string.
   * @param workspaceParams The workspace query parameters.
   * @returns A Promise that resolves to the CSV string of exported issues.
   */
  async exportIssues(
    workspaceParams: WorkspaceRequestParamsDto,
  ): Promise<string> {
    // Find all issues for the given workspace, including related data
    const issues = await this.prisma.issue.findMany({
      where: { team: { workspaceId: workspaceParams.workspaceId } },
      include: {
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
      createdBy: issue.createdById,
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

  async moveIssue(
    userId: string,
    issueId: string,
    teamId: string,
  ): Promise<Issue> {
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

  async getIssuesByFilter(
    getIssuesByFilterData: GetIssuesByFilterDTO,
  ): Promise<Issue[]> {
    const where = getFilterWhere(getIssuesByFilterData);

    return this.prisma.issue.findMany({
      where: where as Prisma.IssueWhereInput,
      include: {
        team: true,
      },
    });
  }
}
