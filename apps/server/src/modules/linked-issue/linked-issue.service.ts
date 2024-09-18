import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  IssueRequestParamsDto,
  LinkIssueInput,
  LinkedIssue,
  LinkedIssueRequestParamsDto,
  UpdateLinkedIssueDto,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { ApiResponse } from 'modules/issues/issues.interface';
import { LoggerService } from 'modules/logger/logger.service';

@Injectable()
export default class LinkedIssueService {
  private readonly logger: LoggerService = new LoggerService(
    'LinkedIssueService',
  );

  constructor(private prisma: PrismaService) {}

  async createLinkIssue(
    linkData: LinkIssueInput,
    issueParams: IssueRequestParamsDto,
    userId: string,
  ): Promise<ApiResponse | LinkedIssue> {
    const linkedIssue = await this.prisma.linkedIssue.findFirst({
      where: { url: linkData.url, deleted: null },
      include: { issue: { include: { team: true } } },
    });
    if (linkedIssue) {
      this.logger.debug({
        message: `This ${linkData.type} has already been linked to an issue ${linkedIssue.issue.team.identifier}-${linkedIssue.issue.number}`,
        where: `LinkedIssueService.createLinkIssue`,
      });
      throw new BadRequestException(
        `This ${linkData.type} has already been linked to an issue ${linkedIssue.issue.team.identifier}-${linkedIssue.issue.number}`,
      );
    }

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
  ): Promise<ApiResponse | LinkedIssue> {
    // Find the linked issue by its ID
    const linkedIssue = await this.prisma.linkedIssue.findUnique({
      where: { id: linkedIssueIdParams.linkedIssueId },
    });

    // Check if the URL or sourceId is being assigned to another issue
    if (linkedIssueData.url || linkedIssueData.sourceId) {
      const linkConditions = {
        ...(linkedIssueData.url && { url: linkedIssueData.url }),
        ...(!linkedIssueData.url &&
          linkedIssueData.sourceId && { sourceId: linkedIssueData.sourceId }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        deleted: null as any,
        NOT: { id: linkedIssueIdParams.linkedIssueId },
      };

      // Find an existing linked issue with the updated URL or sourceId
      const existingLinkedIssue = await this.prisma.linkedIssue.findFirst({
        where: linkConditions,
        include: { issue: { include: { team: true } } },
      });

      // If an existing linked issue is found, throw an error
      if (existingLinkedIssue) {
        throw new BadRequestException(
          `This URL has already been linked to an issue ${existingLinkedIssue.issue.team.identifier}-${existingLinkedIssue.issue.number}`,
        );
      }
    }

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
