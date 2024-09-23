import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CreateLinkedIssueDto,
  IssueRequestParamsDto,
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
    linkData: CreateLinkedIssueDto,
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
            ...linkData.sourceData,
            ...(linkData.title ? { title: linkData.title } : {}),
          },
          ...(linkData.sourceId ? { sourceId: linkData.sourceId } : {}),
          ...(linkData.sync ? { sync: linkData.sync } : {}),
        },
        include: { issue: { include: { team: true } } },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create linked issue');
    }
  }

  async getLinkedIssue(linkedIssueId: string): Promise<LinkedIssue> {
    return this.prisma.linkedIssue.findUnique({
      where: { id: linkedIssueId },
      include: { issue: { include: { team: true } } },
    });
  }

  async getLinkedIssueBySourceId(sourceId: string): Promise<LinkedIssue[]> {
    return this.prisma.linkedIssue.findMany({
      where: { sourceId, deleted: null },
      include: { issue: true },
    });
  }

  async getLinkedIssueByIssueId(issueId: string): Promise<LinkedIssue[]> {
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
  ): Promise<LinkedIssue[]> {
    const linkedIssues = await this.prisma.linkedIssue.findMany({
      where: { sourceId, deleted: null },
    });

    if (linkedIssues.length < 1) {
      return undefined;
    }

    return await Promise.all(
      linkedIssues.map(async (linkedIssue: LinkedIssue) => {
        return await this.updateLinkIssue(
          { linkedIssueId: linkedIssue.id },
          linkedIssueData,
          userId,
        );
      }),
    );
  }

  async deleteLinkIssue(linkedIssueIdParams: LinkedIssueRequestParamsDto) {
    return this.prisma.linkedIssue.update({
      where: { id: linkedIssueIdParams.linkedIssueId },
      data: { deleted: new Date().toISOString() },
    });
  }
}
