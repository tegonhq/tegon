/* eslint-disable @typescript-eslint/no-unused-vars */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { IssueHistory, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  IssueHistoryData,
  IssueHistoryIdRequestParams,
  IssueRelation,
  ReverseIssueRelationType,
} from './issue-history.interface';

@Injectable()
export default class IssuesHistoryService {
  constructor(private prisma: PrismaService) {}

  async upsertIssueHistory(
    userId: string,
    issueId: string,
    issueData: IssueHistoryData,
    sourceData?: Record<string, string>,
  ): Promise<IssueHistory> {
    const lastIssueHistory = await this.prisma.issueHistory.findFirst({
      where: { issueId },
      orderBy: { createdAt: 'desc' },
    });

    // TODO (harshith): Check this unused var
    const { relationChanges, removedLabelIds, addedLabelIds, ...otherData } =
      issueData;
    if (lastIssueHistory && lastIssueHistory.userId === userId) {
      let updatedLabels = lastIssueHistory.addedLabelIds || [];
      let removedUpdatedLabels = lastIssueHistory.removedLabelIds || [];
      if (removedLabelIds) {
        updatedLabels = updatedLabels.filter(
          (label) => !removedLabelIds.includes(label),
        );
        removedUpdatedLabels = [
          ...new Set([...removedLabelIds, ...removedUpdatedLabels]),
        ];
      }
      if (addedLabelIds) {
        updatedLabels = [...new Set([...updatedLabels, ...addedLabelIds])];
      }

      return this.prisma.issueHistory.update({
        where: { id: lastIssueHistory.id },
        data: {
          ...Object.fromEntries(
            // TODO (harshith): Check this unused var
            Object.entries(otherData).filter(([_, value]) => {
              return value !== null;
            }),
          ),
          sourceMetaData: sourceData,
          addedLabelIds: updatedLabels,
          removedLabelIds: removedUpdatedLabels,
        },
      });
    }
    return this.prisma.issueHistory.create({
      data: {
        ...otherData,
        addedLabelIds,
        removedLabelIds,
        userId,
        sourceMetaData: sourceData,
        issue: { connect: { id: issueId } },
      },
    });
  }

  async deleteIssueHistory(issueId: string) {
    return this.prisma.issueHistory.updateMany({
      where: { issueId },
      data: { deleted: new Date().toISOString() },
    });
  }

  async createIssueRelation(
    userId: string,
    issueId: string,
    relationData: IssueRelation,
  ) {
    return await Promise.all([
      this.prisma.issueHistory.create({
        data: {
          userId,
          issueId,
          relationChanges: [relationData as unknown as Prisma.InputJsonValue],
        },
      }),
      this.prisma.issueHistory.create({
        data: {
          userId,
          issueId: relationData.relatedIssueId,
          relationChanges: [
            {
              type: ReverseIssueRelationType[relationData.type],
              issueId: relationData.relatedIssueId,
              relatedIssueId: relationData.issueId,
            },
          ],
        },
      }),
    ]);
  }

  async deleteIssueRelation(
    issueHistoryId: IssueHistoryIdRequestParams,
  ): Promise<IssueHistory> {
    const issueHistory = await this.prisma.issueHistory.update({
      where: { id: issueHistoryId.issueHistoryId },
      data: { deleted: new Date().toISOString() },
    });

    const issueRelation = (
      issueHistory.relationChanges as unknown as IssueRelation[]
    )[0];
    const reverseType = ReverseIssueRelationType[issueRelation.type];

    await this.prisma.$executeRaw`
      UPDATE "IssueHistory"
      SET "deleted" = ${new Date()}
      WHERE "issueId" = ${issueRelation.relatedIssueId}
        AND "deleted" IS NULL
        AND EXISTS (
          SELECT 1
          FROM unnest("relationChanges") AS item
          WHERE item @> jsonb_build_object(
            'relatedIssueId', ${issueHistory.issueId},
            'type', ${reverseType}::text,
            'issueId', ${issueRelation.relatedIssueId}
          )
        )
    `;

    return issueHistory;
  }
}
