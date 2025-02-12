/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import {
  ActionTypesEnum,
  CreateIssueRelationDto,
  IssueRelation,
  IssueRelationEnum,
  IssueRelationIdRequestDto,
  IssueRelationType,
  NotificationData,
  NotificationEventFrom,
} from '@tegonhq/types';
import { tasks } from '@trigger.dev/sdk/v3';
import { PrismaService } from 'nestjs-prisma';
import { notificationHandler } from 'trigger/notification';

import {
  IssueRelationWithIssue,
  ReverseIssueRelationType,
} from './issue-relation.interface';

@Injectable()
export default class IssueRelationService {
  constructor(private prisma: PrismaService) {}

  async createIssueRelation(
    userId: string,
    relationData: CreateIssueRelationDto,
  ): Promise<IssueRelation> {
    const issueRelationData = (await this.prisma.issueRelation.upsert({
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
    })) as IssueRelationWithIssue;

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
          ? issueRelationData.relatedIssueId
          : inverseRelationData.relatedIssueId;

      tasks.trigger<typeof notificationHandler>('notification', {
        event: ActionTypesEnum.ON_CREATE,
        notificationType: NotificationEventFrom.IssueBlocks,
        notificationData: {
          subscriberIds: issueRelationData.issue.subscriberIds,
          issueId,
          issueRelationId,
          workspaceId: issueRelationData.issue.team.workspaceId,
          userId,
        } as NotificationData,
      });
    }

    return issueRelationData;
  }

  async deleteIssueRelation(
    userId: string,
    { issueRelationId }: IssueRelationIdRequestDto,
  ): Promise<IssueRelation> {
    const deleted = new Date().toISOString();

    const issueRelationData = await this.prisma.issueRelation.update({
      where: { id: issueRelationId },
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

      tasks.trigger<typeof notificationHandler>('notification', {
        event: ActionTypesEnum.ON_DELETE,
        notificationType: NotificationEventFrom.DeleteByEvent,
        notificationData: {
          subscriberIds: issueRelationData.issue.subscriberIds,
          issueId,
          issueRelationId:
            issueRelationData.type === IssueRelationType.BLOCKS
              ? issueRelationData.id
              : inverseRelationData.id,
          workspaceId: issueRelationData.issue.team.workspaceId,
          userId,
        } as NotificationData,
      });
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
