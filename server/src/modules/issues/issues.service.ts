/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { Issue, LinkedIssue } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import OpenAI from 'openai';

import IssuesHistoryService from 'modules/issue-history/issue-history.service';

import {
  CreateIssueInput,
  IssueAction,
  IssueRequestParams,
  LinkIssueData,
  LinkIssueInput,
  TeamRequestParams,
  UpdateIssueInput,
} from './issues.interface';
import {
  getIssueDiff,
  getIssueTitle,
  getLastIssueNumber,
  getLinkedIssueWithUrl,
  handleTwoWaySync,
  isValidLinkUrl,
} from './issues.utils';

const openaiClient = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

@Injectable()
export default class IssuesService {
  constructor(
    private prisma: PrismaService,
    private issueHistoryService: IssuesHistoryService,
  ) {}

  async createIssue(
    teamRequestParams: TeamRequestParams,
    issueData: CreateIssueInput,
    userId?: string,
    linkIssuedata?: LinkIssueData,
    linkMetaData?: Record<string, string>,
  ): Promise<Issue> {
    const { parentId, ...otherIssueData } = issueData;
    const lastNumber = await getLastIssueNumber(
      this.prisma,
      teamRequestParams.teamId,
    );
    const issueTitle = await getIssueTitle(openaiClient, issueData);

    const issue = await this.prisma.issue.create({
      data: {
        title: issueTitle,
        number: lastNumber + 1,
        team: { connect: { id: teamRequestParams.teamId } },
        ...otherIssueData,
        ...(userId && { createdBy: { connect: { id: userId } } }),
        ...(parentId && { parent: { connect: { id: parentId } } }),
        ...(linkIssuedata && {
          linkedIssue: { create: linkIssuedata },
        }),
        ...(linkMetaData && { sourceMetadata: linkMetaData }),
      },
      include: {
        team: true,
      },
    });

    await this.createIssueHistory(issue, userId, linkMetaData);
    if (issueData.isBidirectional) {
      await handleTwoWaySync(this.prisma, issue, IssueAction.CREATED, userId);
    }

    return issue;
  }

  async updateIssue(
    teamRequestParams: TeamRequestParams,
    issueData: UpdateIssueInput,
    issueParams: IssueRequestParams,
    userId?: string,
    linkIssuedata?: LinkIssueData,
    linkMetaData?: Record<string, string>,
  ): Promise<Issue> {
    const { parentId, ...otherIssueData } = issueData;
    const issueTitle = await getIssueTitle(openaiClient, issueData);

    const [currentIssue, updatedIssue] = await this.prisma.$transaction([
      this.prisma.issue.findUnique({
        where: { id: issueParams.issueId },
      }),
      this.prisma.issue.update({
        where: {
          id: issueParams.issueId,
          teamId: teamRequestParams.teamId,
        },
        data: {
          ...otherIssueData,
          ...(issueTitle && { title: issueTitle }),
          ...(parentId && { parent: { connect: { id: parentId } } }),
          ...(linkIssuedata && {
            linkedIssue: {
              upsert: {
                where: { url: linkIssuedata.url },
                update: linkIssuedata,
                create: linkIssuedata,
              },
            },
          }),
        },
        include: {
          team: true,
        },
      }),
    ]);

    await this.updateIssueHistory(
      updatedIssue,
      currentIssue,
      userId,
      linkMetaData,
    );
    if (updatedIssue.isBidirectional) {
      await handleTwoWaySync(
        this.prisma,
        updatedIssue,
        IssueAction.CREATED,
        userId,
      );
    }

    return updatedIssue;
  }

  async deleteIssue(
    teamRequestParams: TeamRequestParams,
    issueParams: IssueRequestParams,
  ): Promise<Issue> {
    const deleteIssue = await this.prisma.issue.update({
      where: {
        id: issueParams.issueId,
        teamId: teamRequestParams.teamId,
      },
      data: {
        deleted: new Date().toISOString(),
      },
    });

    await this.deleteIssueHistory(deleteIssue.id);

    return deleteIssue;
  }

  async deleteIssuePermenant(
    teamRequestParams: TeamRequestParams,
    issueParams: IssueRequestParams,
  ): Promise<Issue> {
    return await this.prisma.issue.delete({
      where: {
        id: issueParams.issueId,
        teamId: teamRequestParams.teamId,
      },
    });
  }

  private async createIssueHistory(
    issue: Issue,
    userId?: string,
    linkMetaData?: Record<string, string>,
  ): Promise<void> {
    await this.issueHistoryService.upsertIssueHistory(
      userId,
      issue.id,
      await getIssueDiff(issue, null),
      linkMetaData,
    );
  }

  private async updateIssueHistory(
    updatedIssue: Issue,
    currentIssue: Issue | null,
    userId?: string,
    linkMetaData?: Record<string, string>,
  ): Promise<void> {
    await this.issueHistoryService.upsertIssueHistory(
      userId,
      updatedIssue.id,
      await getIssueDiff(updatedIssue, currentIssue),
      linkMetaData,
    );
  }

  private async deleteIssueHistory(issueId: string): Promise<void> {
    await this.issueHistoryService.deleteIssueHistory(issueId);
  }

  async createLinkIssue(
    teamParams: TeamRequestParams,
    linkData: LinkIssueInput,
    issueParams: IssueRequestParams,
    userId: string,
  ): Promise<{ status: number; message: string } | LinkedIssue> {
    if (!isValidLinkUrl(linkData)) {
      return { status: 400, message: "Provided url doesn't exists" };
    }

    const linkedIssue = await this.prisma.linkedIssue.findFirst({
      where: { url: linkData.url },
      include: { issue: { include: { team: true } } },
    });
    if (linkedIssue) {
      return {
        status: 400,
        message: `This ${linkData.type} has already been linked to an issue ${linkedIssue.issue.team.identifier}-${linkedIssue.issue.number}`,
      };
    }
    try {
      return await getLinkedIssueWithUrl(
        this.prisma,
        linkData,
        teamParams.teamId,
        issueParams.issueId,
        userId,
      );
    } catch (error) {
      return { status: 500, message: 'Failed to create linked issue' };
    }
  }
}
