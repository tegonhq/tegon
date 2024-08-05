/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import {
  IssueRelation,
  IssueRelationEnum,
  IssueRelationType,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { NotificationEventFrom } from 'modules/notifications/notifications.interface';
import { NotificationsQueue } from 'modules/notifications/notifications.queue';

import {
  IssueRelationIdRequestParams,
  IssueRelationInput,
  ReverseIssueRelationType,
} from './issue-relation.interface';

@Injectable()
export default class IssueRelationService {
  constructor(
    private prisma: PrismaService,
    private notificationsQueue: NotificationsQueue,
  ) {}

  async createIssueRelation(
    userId: string,
    relationData: IssueRelationInput,
  ): Promise<IssueRelation> {
    const issueRelationData = await this.prisma.issueRelation.upsert({
      where: {
        issueId_relatedIssueId_type: {
          issueId: relationData.issueId,
          relatedIssueId: relationData.relatedIssueId,
          type: relationData.type,
        },
      },
      update: {
        deleted: null,
      },
      create: {
        createdById: userId,
        ...relationData,
      },
      include: { issue: { include: { team: true } } },
    });

    const inverseRelationData = await this.prisma.issueRelation.upsert({
      where: {
        issueId_relatedIssueId_type: {
          issueId: relationData.relatedIssueId,
          relatedIssueId: relationData.issueId,
          type: ReverseIssueRelationType[relationData.type],
        },
      },
      update: {
        deleted: null,
      },
      create: {
        createdById: userId,
        issueId: relationData.relatedIssueId,
        relatedIssueId: relationData.issueId,
        type: ReverseIssueRelationType[relationData.type],
      },
    });

    if (relationData.type !== IssueRelationType.SIMILAR) {
      await this.createIssueHistory(userId, issueRelationData);
    }

    if (
      relationData.type === IssueRelationType.BLOCKS ||
      relationData.type === IssueRelationType.BLOCKED
    ) {
      const issueId =
        relationData.type === IssueRelationType.BLOCKS
          ? issueRelationData.issueId
          : inverseRelationData.issueId;

      const issueRelationId =
        relationData.type === IssueRelationType.BLOCKS
          ? issueRelationData.id
          : inverseRelationData.id;

      await this.notificationsQueue.addToNotification(
        NotificationEventFrom.IssueBlocks,
        userId,
        {
          subscriberIds: issueRelationData.issue.subscriberIds,
          issueId,
          issueRelationId,
          workspaceId: issueRelationData.issue.team.workspaceId,
        },
      );
    }

    return issueRelationData;
  }

  async deleteIssueRelation(
    userId: string,
    issueRelationId: IssueRelationIdRequestParams,
  ): Promise<IssueRelation> {
    const deleted = new Date().toISOString();

    const issueRelationData = await this.prisma.issueRelation.update({
      where: { id: issueRelationId.issueRelationId },
      data: { deleted, deletedById: userId },
      include: { issue: { include: { team: true } } },
    });

    const inverseRelationData = await this.prisma.issueRelation.update({
      where: {
        issueId_relatedIssueId_type: {
          issueId: issueRelationData.relatedIssueId,
          relatedIssueId: issueRelationData.issueId,
          type: ReverseIssueRelationType[issueRelationData.type],
        },
      },
      data: { deleted, deletedById: userId },
    });

    if (issueRelationData.type !== IssueRelationType.SIMILAR) {
      await this.createIssueHistory(userId, issueRelationData, true);
    }

    if (
      issueRelationData.type === IssueRelationType.BLOCKS ||
      issueRelationData.type === IssueRelationType.BLOCKED
    ) {
      const issueId =
        issueRelationData.type === IssueRelationType.BLOCKS
          ? issueRelationData.issueId
          : inverseRelationData.issueId;

      await this.notificationsQueue.deleteNotificationByEvent(
        NotificationEventFrom.IssueBlocks,
        {
          subscriberIds: issueRelationData.issue.subscriberIds,
          issueId,
          issueRelationId:
            issueRelationData.type === IssueRelationType.BLOCKS
              ? issueRelationData.id
              : inverseRelationData.id,
          workspaceId: issueRelationData.issue.team.workspaceId,
        },
      );
    }

    return issueRelationData;
  }

  async createIssueHistory(
    userId: string,
    issueRelation: IssueRelation,
    isDeleted?: boolean,
  ) {
    await this.prisma.issueHistory.createMany({
      data: [
        {
          issueId: issueRelation.issueId,
          userId,
          relationChanges: {
            issueId: issueRelation.issueId,
            relatedIssueId: issueRelation.relatedIssueId,
            type: issueRelation.type,
            ...(isDeleted !== undefined && { isDeleted }),
          },
        },
        {
          issueId: issueRelation.relatedIssueId,
          userId,
          relationChanges: {
            issueId: issueRelation.relatedIssueId,
            relatedIssueId: issueRelation.issueId,
            type: ReverseIssueRelationType[
              issueRelation.type as IssueRelationEnum
            ],
            ...(isDeleted !== undefined && { isDeleted }),
          },
        },
      ],
    });
  }
}
