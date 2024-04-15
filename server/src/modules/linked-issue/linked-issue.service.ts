/** Copyright (c) 2024, Tegon, all rights reserved. **/

<<<<<<< HEAD
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
=======
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
>>>>>>> 35fbe6f (Feat: added slack)
import { LinkedIssue } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  ApiResponse,
  IssueRequestParams,
  TeamRequestParams,
} from 'modules/issues/issues.interface';

import {
  CreateLinkIssueInput,
  LinkIssueInput,
  LinkedIssueIdParams,
  UpdateLinkedIssueAPIData,
  UpdateLinkedIssueData,
} from './linked-issue.interface';
import {
  getLinkedIssueDataWithUrl,
  isValidLinkUrl,
  sendFirstComment,
} from './linked-issue.utils';

@Injectable()
export default class LinkedIssueService {
  private readonly logger: Logger = new Logger('LinkedIssueService');

  constructor(private prisma: PrismaService) {}

  async createLinkIssue(
    teamParams: TeamRequestParams,
    linkData: LinkIssueInput,
    issueParams: IssueRequestParams,
    userId: string,
  ): Promise<ApiResponse | LinkedIssue> {
    if (!isValidLinkUrl(linkData)) {
      throw new BadRequestException("Provided url doesn't exist");
    }

    const linkedIssue = await this.prisma.linkedIssue.findFirst({
      where: { url: linkData.url, deleted: null },
      include: { issue: { include: { team: true } } },
    });
    if (linkedIssue) {
      throw new BadRequestException(
        `This ${linkData.type} has already been linked to an issue ${linkedIssue.issue.team.identifier}-${linkedIssue.issue.number}`,
      );
    }
    try {
      const { integrationAccount, linkInput } = await getLinkedIssueDataWithUrl(
        this.prisma,
        linkData,
        teamParams.teamId,
        issueParams.issueId,
        userId,
      );

      const linkedIssue = await this.createLinkIssueAPI(linkInput);

      //   send a first comment function
      await sendFirstComment(
        this.prisma,
        this.logger,
        this,
        integrationAccount,
        linkedIssue,
        linkData.type,
      );
      return linkedIssue;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create linked issue');
    }
  }

  async createLinkIssueAPI(linkIssueData: CreateLinkIssueInput) {
    return this.prisma.linkedIssue.upsert({
      where: { url: linkIssueData.url },
      update: { deleted: null, ...linkIssueData },
      create: linkIssueData,
      include: {
        issue: { include: { team: { include: { workspace: true } } } },
      },
    });
  }

  async getLinkedIssueBySourceId(sourceId: string) {
    return this.prisma.linkedIssue.findFirst({
      where: { sourceId, deleted: null },
      include: { issue: true },
    });
  }

  async updateLinkIssue(
    linkedIssueIdParams: LinkedIssueIdParams,
    linkedIssueData: UpdateLinkedIssueData,
  ): Promise<ApiResponse | LinkedIssue> {
    const linkedIssue = await this.prisma.linkedIssue.findUnique({
      where: { id: linkedIssueIdParams.linkedIssueId },
    });

    if (linkedIssueData.url) {
      const existingLinkedIssue = await this.prisma.linkedIssue.findFirst({
        where: {
          url: linkedIssueData.url,
          deleted: null,
          NOT: { id: linkedIssueIdParams.linkedIssueId },
        },
        include: { issue: { include: { team: true } } },
      });
      if (existingLinkedIssue) {
        throw new BadRequestException(
          `This URL has already been linked to an issue ${existingLinkedIssue.issue.team.identifier}-${existingLinkedIssue.issue.number}`,
        );
      }
    }

    const sourceData = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(linkedIssue.sourceData as any),
      title: linkedIssueData.title,
    };

    return this.prisma.linkedIssue.update({
      where: { id: linkedIssueIdParams.linkedIssueId },
      data: {
        url: linkedIssueData.url,
        sourceData,
      },
    });
  }

  async updateLinkIssueApi(
    linkedIssueIdParams: LinkedIssueIdParams,
    linkedIssueData: UpdateLinkedIssueAPIData,
  ) {
    return this.prisma.linkedIssue.update({
      where: { id: linkedIssueIdParams.linkedIssueId },
      data: linkedIssueData,
    });
  }

  async deleteLinkIssue(linkedIssueIdParams: LinkedIssueIdParams) {
    this.prisma.linkedIssue.update({
      where: { id: linkedIssueIdParams.linkedIssueId },
      data: { deleted: new Date().toISOString() },
    });

    return this.prisma.linkedIssue.delete({
      where: { id: linkedIssueIdParams.linkedIssueId },
    });
  }
}
