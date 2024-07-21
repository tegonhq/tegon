/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { IssueHistory } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { IssueHistoryData } from './issue-history.interface';

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

    const { removedLabelIds, addedLabelIds, ...otherData } = issueData;
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

    if (
      (removedLabelIds && removedLabelIds.length > 0) ||
      (addedLabelIds && addedLabelIds.length > 0) ||
      Object.values(otherData).some((val) => val !== null && val !== undefined)
    ) {
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
    return undefined;
  }

  async deleteIssueHistory(issueId: string) {
    return this.prisma.issueHistory.updateMany({
      where: { issueId },
      data: { deleted: new Date().toISOString() },
    });
  }
}
