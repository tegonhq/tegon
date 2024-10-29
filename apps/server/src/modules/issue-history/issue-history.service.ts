/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { IssueHistory, IssueHistoryData } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

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
            Object.entries(otherData).filter(([key, value]) => {
              const isToField = key.startsWith('to');
              const isFromField = key.startsWith('from');
              if (isToField) {
                const fromField =
                  `from${key.slice(2)}` as keyof typeof otherData;
                return value !== null || otherData[fromField] !== null;
              } else if (isFromField) {
                const toField = `to${key.slice(4)}` as keyof typeof otherData;
                return value !== null || otherData[toField] !== null;
              }
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
