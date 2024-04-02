/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable, Logger } from '@nestjs/common';
import { Issue } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import OpenAI from 'openai';

import { IssueHistoryData } from 'modules/issue-history/issue-history.interface';
import IssuesHistoryService from 'modules/issue-history/issue-history.service';
import { IssueRelationInput } from 'modules/issue-relation/issue-relation.interface';
import IssueRelationService from 'modules/issue-relation/issue-relation.service';
import { LinkIssueData } from 'modules/linked-issue/linked-issue.interface';
import { getLinkType } from 'modules/linked-issue/linked-issue.utils';
import { NotificationEventFrom } from 'modules/notifications/notifications.interface';
import { NotificationsQueue } from 'modules/notifications/notifications.queue';

import {
  ApiResponse,
  CreateIssueInput,
  IssueAction,
  IssueRequestParams,
  IssueWithRelations,
  RelationInput,
  SubscribeType,
  TeamRequestParams,
  UpdateIssueInput,
} from './issues.interface';
import { IssuesQueue } from './issues.queue';
import {
  findExistingLink,
  getIssueDiff,
  getIssueTitle,
  getLastIssueNumber,
  getSubscriberIds,
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
      linkIssue.type = await getLinkType(linkIssue.url);
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
    const { parentId, issueRelation, ...otherIssueData } = issueData;

    const currentIssue = await this.prisma.issue.findUnique({
      where: { id: issueParams.issueId },
    });

    const updatedIssueData = {
      subscriberIds: getSubscriberIds(
        userId,
        issueData.assigneeId,
        currentIssue.subscriberIds,
        SubscribeType.SUBSCRIBE,
      ),
      ...otherIssueData,
      ...(parentId && { parent: { connect: { id: parentId } } }),
      ...(linkIssuedata && {
        linkedIssue: {
          upsert: {
            where: { url: linkIssuedata.url },
            update: linkIssuedata,
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

    this.logger.log(`Issue ${deleteIssue.id} marked as deleted`);

    await this.deleteIssueHistory(deleteIssue.id);

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
}
