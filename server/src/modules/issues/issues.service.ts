/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable, Logger } from '@nestjs/common';
import { Issue } from '@prisma/client';
import { createObjectCsvStringifier } from 'csv-writer';
import { PrismaService } from 'nestjs-prisma';
import OpenAI from 'openai';

import { convertTiptapJsonToText } from 'common/utils/tiptap.utils';

import { IssueHistoryData } from 'modules/issue-history/issue-history.interface';
import IssuesHistoryService from 'modules/issue-history/issue-history.service';
import { IssueRelationInput } from 'modules/issue-relation/issue-relation.interface';
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

  async createIssue(
    teamRequestParams: TeamRequestParams,
    issueData: CreateIssueInput,
    userId?: string,
    linkIssuedata?: LinkIssueData,
    linkMetaData?: Record<string, string>,
  ): Promise<ApiResponse | Issue> {
    const { linkIssue, ...otherIssueData } = issueData;

    this.logger.debug(
      `Creating issue with data: ${JSON.stringify(otherIssueData)}`,
    );

    const linkStatus = linkIssue
      ? await findExistingLink(this.prisma, linkIssue)
      : null;
    if (linkStatus?.status === 400) {
      this.logger.error(
        `Error finding existing link: ${JSON.stringify(linkStatus)}`,
      );
      return linkStatus;
    }

    const issue = await this.createIssueAPI(
      teamRequestParams,
      otherIssueData,
      userId,
      linkIssuedata,
      linkMetaData,
    );

    this.logger.log(`Created issue: ${issue.number}`);

    if (linkIssue) {
      linkIssue.type = getLinkType(linkIssue.url) as LinkedIssueSubType;
      this.logger.log(
        `Adding create link issue job for link: ${linkIssue.url}`,
      );
      this.issuesQueue.addCreateLinkIssueJob(
        teamRequestParams,
        linkIssue,
        { issueId: issue.id },
        userId,
      );
    } else if (otherIssueData.isBidirectional) {
      this.logger.log(`Adding two-way sync job for issue: ${issue.id}`);
      this.issuesQueue.addTwoWaySyncJob(issue, IssueAction.CREATED, userId);
    }
    this.issuesQueue.addIssueToVector(issue);

    return issue;
  }

  async createIssueAPI(
    teamRequestParams: TeamRequestParams,
    issueData: CreateIssueInput,
    userId?: string,
    linkIssuedata?: LinkIssueData,
    linkMetaData?: Record<string, string>,
  ): Promise<IssueWithRelations> {
    const { parentId, issueRelation, ...otherIssueData } = issueData;
    const lastNumber = await getLastIssueNumber(
      this.prisma,
      teamRequestParams.teamId,
    );
    const issueTitle = await getIssueTitle(openaiClient, issueData);
    const subscriberIds = getSubscriberIds(
      userId,
      issueData.assigneeId,
      null,
      SubscribeType.SUBSCRIBE,
    );

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

    await this.upsertIssueHistory(
      issue,
      await getIssueDiff(issue, null),
      userId,
      linkMetaData,
      issueRelation,
    );

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
    return issue;
  }

  async updateIssue(
    teamRequestParams: TeamRequestParams,
    issueData: UpdateIssueInput,
    issueParams: IssueRequestParams,
    userId?: string,
    linkIssuedata?: LinkIssueData,
    linkMetaData?: Record<string, string>,
  ): Promise<Issue> {
    this.logger.log(`Updating issue with ID: ${issueParams.issueId}`);

    const updatedIssue = await this.updateIssueApi(
      teamRequestParams,
      issueData,
      issueParams,
      userId,
      linkIssuedata,
      linkMetaData,
    );

    if (updatedIssue.isBidirectional) {
      this.logger.log(`Adding two-way sync job for issue: ${updatedIssue.id}`);
      this.issuesQueue.addTwoWaySyncJob(
        updatedIssue,
        IssueAction.UPDATED,
        userId,
      );
    }

    this.issuesQueue.addIssueToVector(updatedIssue);
    return updatedIssue;
  }

  async updateIssueApi(
    teamRequestParams: TeamRequestParams,
    issueData: UpdateIssueInput,
    issueParams: IssueRequestParams,
    userId?: string,
    linkIssuedata?: LinkIssueData,
    linkMetaData?: Record<string, string>,
  ) {
    const {
      parentId,
      issueRelation,
      subscriberIds = null,
      ...otherIssueData
    } = issueData;

    const currentIssue = await this.prisma.issue.findUnique({
      where: { id: issueParams.issueId },
    });

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

    const issueDiff = await getIssueDiff(updatedIssue, currentIssue);

    this.upsertIssueHistory(
      updatedIssue,
      issueDiff,
      userId,
      linkMetaData,
      issueRelation,
    );

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

    return updatedIssue;
  }

  async deleteIssue(
    teamRequestParams: TeamRequestParams,
    issueParams: IssueRequestParams,
  ): Promise<Issue> {
    this.logger.log(
      `Deleting issue with id ${issueParams.issueId} for team ${teamRequestParams.teamId}`,
    );

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

    await this.deleteIssueHistory(deleteIssue.id);
    await this.notificationsQueue.deleteNotificationsByIssue(deleteIssue.id);

    this.logger.log(`Issue history deleted for issue ${deleteIssue.id}`);

    return deleteIssue;
  }

  private async upsertIssueHistory(
    issue: Issue,
    issueDiff: IssueHistoryData,
    userId?: string,
    linkMetaData?: Record<string, string>,
    issueRelation?: RelationInput,
  ): Promise<void> {
    this.logger.log(`Upserting issue history for issue ${issue.id}`);
    await this.issueHistoryService.upsertIssueHistory(
      userId,
      issue.id,
      issueDiff,
      linkMetaData,
    );

    if (issueRelation) {
      this.logger.log(`Creating issue relation for issue ${issue.id}`);

      const relationInput: IssueRelationInput = {
        issueId: issueRelation.issueId || issue.id,
        relatedIssueId: issueRelation.relatedIssueId || issue.id,
        type: issueRelation.type,
      };

      await this.issueRelationService.createIssueRelation(
        userId,
        relationInput,
      );
    }
  }

  private async deleteIssueHistory(issueId: string): Promise<void> {
    this.logger.log(`Deleting issue history for issue ${issueId}`);
    await this.issueHistoryService.deleteIssueHistory(issueId);
  }

  async handleSubscription(
    userId: string,
    issueId: string,
    type: SubscribeType,
  ) {
    const issue = await this.prisma.issue.findUnique({
      where: { id: issueId },
    });
    const subscriberIds = getSubscriberIds(
      userId,
      null,
      issue.subscriberIds,
      type,
    );
    return await this.prisma.issue.update({
      where: { id: issueId },
      data: { subscriberIds },
    });
  }

  async suggestions(
    teamRequestParams: TeamRequestParams,
    suggestionsInput: SuggestionsInput,
  ) {
    if (!suggestionsInput.description) {
      return { labels: [], assignees: [] };
    }

    const labels = await this.prisma.label.findMany({
      where: {
        OR: [
          { workspaceId: suggestionsInput.workspaceId },
          { teamId: teamRequestParams.teamId },
        ],
      },
    });

    const [labelsSuggested, similarIssues] = await Promise.all([
      getSuggestedLabels(
        openaiClient,
        labels.map((label) => label.name),
        suggestionsInput.description,
      ),
      this.vectorService.searchEmbeddings(
        suggestionsInput.workspaceId,
        suggestionsInput.description,
        5,
        0.5,
      ),
    ]);

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

    const assigneeIds = new Set(
      similarIssues
        .filter((issue) => issue.assigneeId)
        .map((issue) => issue.assigneeId),
    );

    const assignees = Array.from(assigneeIds).map((assigneeId) => ({
      id: assigneeId,
      score: similarIssues.find((issue) => issue.assigneeId === assigneeId)
        .score,
    }));

    return { labels: suggestedLabels, assignees };
  }

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

  async exportIssues(workspaceParams: WorkspaceQueryParams): Promise<string> {
    const issues = await this.prisma.issue.findMany({
      where: { team: { workspaceId: workspaceParams.workspaceId } },
      include: {
        createdBy: true,
        parent: true,
        team: true,
      },
    });

    const labelIds = [...new Set(issues.flatMap((issue) => issue.labelIds))];
    const labelMap =
      labelIds.length > 0
        ? new Map(
            await this.prisma.label
              .findMany({ where: { id: { in: labelIds } } })
              .then((labels) => labels.map((label) => [label.id, label])),
          )
        : new Map();

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
}
