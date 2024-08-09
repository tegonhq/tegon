import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  CreateLinkIssueInput,
  IntegrationInternalInput,
  InternalActionTypeEnum,
  LinkedIssue,
  LinkIssueInput,
} from '@tegonhq/types';
import { runs, tasks } from '@trigger.dev/sdk/v3';
import { PrismaService } from 'nestjs-prisma';

import {
  ApiResponse,
  IssueRequestParams,
} from 'modules/issues/issues.interface';

import {
  LinkedIssueIdParams,
  UpdateLinkedIssueData,
} from './linked-issue.interface';
import { getLinkDetails } from './linked-issue.utils';

@Injectable()
export default class LinkedIssueService {
  private readonly logger: Logger = new Logger('LinkedIssueService');

  constructor(private prisma: PrismaService) {}

  async createLinkIssue(
    linkData: LinkIssueInput,
    issueParams: IssueRequestParams,
    userId: string,
  ): Promise<ApiResponse | LinkedIssue> {
    const linkedIssue = await this.prisma.linkedIssue.findFirst({
      where: { url: linkData.url, deleted: null },
      include: { issue: { include: { team: true } } },
    });
    if (linkedIssue) {
      this.logger.debug(
        `This ${linkData.type} has already been linked to an issue ${linkedIssue.issue.team.identifier}-${linkedIssue.issue.number}`,
      );
      throw new BadRequestException(
        `This ${linkData.type} has already been linked to an issue ${linkedIssue.issue.team.identifier}-${linkedIssue.issue.number}`,
      );
    }
    try {
      if (linkData.type === 'ExternalLink') {
        return this.prisma.linkedIssue.create({
          data: {
            url: linkData.url,
            issueId: issueParams.issueId,
            createdById: userId,
            source: { type: 'ExternalLink' },
          },
        });
      }

      const handler = await tasks.trigger(`${linkData.type.toLowerCase()}`, {
        actionType: InternalActionTypeEnum.LinkIssue,
        accesstoken: '',
        payload: {
          url: linkData.url,
          userId,
          issueId: issueParams.issueId,
          type: linkData.type,
          subType: linkData.subType,
        },
      } as IntegrationInternalInput);

      const runResponse = await runs.poll(handler.id);

      if (runResponse.status === 'COMPLETED') {
        return JSON.parse(runResponse.output) as LinkedIssue;
      } else if (runResponse.status === 'FAILED') {
        const error = runResponse.attempts[0].error;
        throw new BadRequestException(error.message);
      }

      // const { integrationAccount, linkInput, linkDataType } =
      //   await getLinkedIssueDataWithUrl(
      //     this.prisma,
      //     linkData,
      //     teamParams.teamId,
      //     issueParams.issueId,
      //     userId,
      //   );

      // linkedIssue = await this.createLinkIssueAPI(linkInput);

      // await this.prisma.issue.update({
      //   where: { id: issueParams.issueId },
      //   data: { isBidirectional: true },
      // });

      // //   send a first comment function
      // await sendFirstComment(
      //   this.prisma,
      //   this.logger,
      //   this,
      //   integrationAccount,
      //   linkedIssue,
      //   linkDataType,
      // );
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
        issue: { include: { team: true } },
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

    const sourceData = linkedIssueData.sourceData || linkedIssue.sourceData;
    const finalSourceData = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(sourceData as any),
      title: linkedIssueData.title,
    };

    return this.prisma.linkedIssue.update({
      where: { id: linkedIssueIdParams.linkedIssueId },
      data: {
        sourceData: finalSourceData,
        ...(linkedIssueData.url && { url: linkedIssueData.url }),
        ...(linkedIssueData.source && { source: linkedIssueData.source }),
      },
    });
  }

  async updateLinkIssueBySource(
    sourceId: string,
    linkedIssueData: UpdateLinkedIssueData,
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
    );
  }

  async deleteLinkIssue(linkedIssueIdParams: LinkedIssueIdParams) {
    return this.prisma.linkedIssue.update({
      where: { id: linkedIssueIdParams.linkedIssueId },
      data: { deleted: new Date().toISOString() },
    });
  }

  async linkedIssueDetails(linkedIssueIdParams: LinkedIssueIdParams) {
    const linkedIssue = await this.prisma.linkedIssue.findUnique({
      where: { id: linkedIssueIdParams.linkedIssueId },
    });

    return await getLinkDetails(this.prisma, linkedIssue);
  }
}
