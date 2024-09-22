import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  IssueRequestParamsDto,
  LinkIssueInput,
  LinkedIssue,
  LinkedIssueRequestParamsDto,
  UpdateLinkedIssueDto,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { ApiResponse } from 'modules/issues/issues.interface';

@Injectable()
export default class LinkedIssueService {
  constructor(private prisma: PrismaService) {}

  async createLinkIssue(
    linkData: LinkIssueInput,
    issueParams: IssueRequestParamsDto,
    userId: string,
  ): Promise<ApiResponse | LinkedIssue> {
    const createdByInfo = {
      updatedById: userId,
      createdById: userId,
    };

    try {
      return await this.prisma.linkedIssue.create({
        data: {
          ...createdByInfo,
          url: linkData.url,
          issueId: issueParams.issueId,
          sourceData: {
            ...(linkData.title ? { title: linkData.title } : {}),
          },
          ...(linkData.sync ? { sync: linkData.sync } : {}),
        },
        include: { issue: { include: { team: true } } },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create linked issue');
    }
  }

  async getLinkedIssue(linkedIssueId: string) {
    return this.prisma.linkedIssue.findUnique({
      where: { id: linkedIssueId },
      include: { issue: { include: { team: true } } },
    });
  }

  async getLinkedIssueBySourceId(sourceId: string) {
    return this.prisma.linkedIssue.findFirst({
      where: { sourceId, deleted: null },
      include: { issue: true },
    });
  }

  async getLinkedIssueByIssueId(issueId: string) {
    return this.prisma.linkedIssue.findMany({
      where: { issueId, deleted: null },
    });
  }

  async getLinkedIssueByUrl(url: string): Promise<LinkedIssue[]> {
    return this.prisma.linkedIssue.findMany({ where: { url } });
  }

  async updateLinkIssue(
    linkedIssueIdParams: LinkedIssueRequestParamsDto,
    linkedIssueData: UpdateLinkedIssueDto,
    userId: string,
  ): Promise<LinkedIssue> {
    // Find the linked issue by its ID
    const linkedIssue = await this.prisma.linkedIssue.findUnique({
      where: { id: linkedIssueIdParams.linkedIssueId },
    });

    // Merge the existing sourceData with the updated sourceData
    const finalSourceData = {
      ...(typeof linkedIssue.sourceData === 'object' &&
      linkedIssue.sourceData !== null
        ? linkedIssue.sourceData
        : {}),
      ...linkedIssueData.sourceData,
      ...(linkedIssueData.title && { title: linkedIssueData.title }),
    };

    // Update the linked issue with the provided data
    return this.prisma.linkedIssue.update({
      where: { id: linkedIssueIdParams.linkedIssueId },
      data: {
        sourceData: finalSourceData,
        updatedById: userId,
        ...(linkedIssueData.url && { url: linkedIssueData.url }),
        ...(linkedIssueData.sourceId && { sourceId: linkedIssueData.sourceId }),
      },
      include: { issue: { include: { team: true } } },
    });
  }

  async updateLinkIssueBySource(
    sourceId: string,
    linkedIssueData: UpdateLinkedIssueDto,
    userId: string,
  ) {
    const linkedIssue = await this.prisma.linkedIssue.findFirst({
      where: { sourceId, deleted: null },
    });

    if (!linkedIssue) {
      return undefined;
    }

    return await this.updateLinkIssue(
      { linkedIssueId: linkedIssue.id },
      linkedIssueData,
      userId,
    );
  }

  async deleteLinkIssue(linkedIssueIdParams: LinkedIssueRequestParamsDto) {
    return this.prisma.linkedIssue.update({
      where: { id: linkedIssueIdParams.linkedIssueId },
      data: { deleted: new Date().toISOString() },
    });
  }
}
