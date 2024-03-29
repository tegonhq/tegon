/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Issue } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import OpenAI from 'openai';

import IssuesHistoryService from 'modules/issue-history/issue-history.service';
import { IssueRelationInput } from 'modules/issue-relation/issue-relation.interface';
import IssueRelationService from 'modules/issue-relation/issue-relation.service';
import { LinkIssueData } from 'modules/linked-issue/linked-issue.interface';
import { getLinkType } from 'modules/linked-issue/linked-issue.utils';

import {
  ApiResponse,
  CreateIssueInput,
  IssueAction,
  IssueRequestParams,
  IssueWithRelations,
  RelationInput,
  TeamRequestParams,
  UpdateIssueInput,
} from './issues.interface';
import { IssuesQueue } from './issues.queue';
import {
  findExistingLink,
  getIssueDiff,
  getIssueTitle,
  getLastIssueNumber,
} from './issues.utils';
// import { VectorService } from 'modules/vector/vector.service';

const openaiClient = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

@Injectable()
export default class IssuesService implements OnModuleInit {
  private readonly logger: Logger = new Logger('IssueService');

  constructor(
    private prisma: PrismaService,
    private issueHistoryService: IssuesHistoryService,
    private issuesQueue: IssuesQueue,
    private issueRelationService: IssueRelationService,
    // private vectorService: VectorService,
  ) {}

  async onModuleInit() {
    // const issue = await this.prisma.issue.findUnique({
    //   where: { id: 'a5bec589-4c0c-40cf-adb9-b3d60d374d05' },
    //   include: { team: true },
    // });
    // await this.vectorService.createIssueEmbedding(
    //   issue.team.workspaceId,
    //   issue,
    // );
  }

  async createIssue(
    teamRequestParams: TeamRequestParams,
    issueData: CreateIssueInput,
    userId?: string,
    linkIssuedata?: LinkIssueData,
    linkMetaData?: Record<string, string>,
  ): Promise<ApiResponse | Issue> {
    const { linkIssue, ...otherIssueData } = issueData;

    this.logger.debug(
      `Creating issue with data: ${JSON.stringify(otherIssueData)}`,
    );

    const linkStatus = linkIssue
      ? await findExistingLink(this.prisma, linkIssue)
      : null;
    if (linkStatus?.status === 400) {
      this.logger.error(
        `Error finding existing link: ${JSON.stringify(linkStatus)}`,
      );
      return linkStatus;
    }

    const issue = await this.createIssueAPI(
      teamRequestParams,
      otherIssueData,
      userId,
      linkIssuedata,
      linkMetaData,
    );

    this.logger.log(`Created issue: ${issue.number}`);

    if (linkIssue) {
      linkIssue.type = await getLinkType(linkIssue.url);
      this.logger.log(
        `Adding create link issue job for link: ${linkIssue.url}`,
      );
      await this.issuesQueue.addCreateLinkIssueJob(
        teamRequestParams,
        linkIssue,
        { issueId: issue.id },
        userId,
      );
    } else if (otherIssueData.isBidirectional) {
      this.logger.log(`Adding two-way sync job for issue: ${issue.id}`);
      await this.issuesQueue.addTwoWaySyncJob(
        issue,
        IssueAction.CREATED,
        userId,
      );
    }

    return issue;
  }

  async createIssueAPI(
    teamRequestParams: TeamRequestParams,
    issueData: CreateIssueInput,
    userId?: string,
    linkIssuedata?: LinkIssueData,
    linkMetaData?: Record<string, string>,
  ): Promise<IssueWithRelations> {
    const { parentId, issueRelation, ...otherIssueData } = issueData;
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

    await this.upsertIssueHistory(
      issue,
      null,
      userId,
      linkMetaData,
      issueRelation,
    );
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
    this.logger.log(`Updating issue with ID: ${issueParams.issueId}`);

    const updatedIssue = await this.updateIssueApi(
      teamRequestParams,
      issueData,
      issueParams,
      userId,
      linkIssuedata,
      linkMetaData,
    );

    if (updatedIssue.isBidirectional) {
      this.logger.log(`Adding two-way sync job for issue: ${updatedIssue.id}`);
      await this.issuesQueue.addTwoWaySyncJob(
        updatedIssue,
        IssueAction.UPDATED,
        userId,
      );
    }

    return updatedIssue;
  }

  async updateIssueApi(
    teamRequestParams: TeamRequestParams,
    issueData: UpdateIssueInput,
    issueParams: IssueRequestParams,
    userId?: string,
    linkIssuedata?: LinkIssueData,
    linkMetaData?: Record<string, string>,
  ) {
    const { parentId, issueRelation, ...otherIssueData } = issueData;

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

    this.logger.log(
      `Issue with ID ${issueParams.issueId} updated successfully`,
    );

    await this.upsertIssueHistory(
      updatedIssue,
      currentIssue,
      userId,
      linkMetaData,
      issueRelation,
    );

    return updatedIssue;
  }

  async deleteIssue(
    teamRequestParams: TeamRequestParams,
    issueParams: IssueRequestParams,
  ): Promise<Issue> {
    this.logger.log(
      `Deleting issue with id ${issueParams.issueId} for team ${teamRequestParams.teamId}`,
    );

    const deleteIssue = await this.prisma.issue.update({
      where: {
        id: issueParams.issueId,
        teamId: teamRequestParams.teamId,
      },
      data: {
        deleted: new Date().toISOString(),
      },
    });

    this.logger.log(`Issue ${deleteIssue.id} marked as deleted`);

    await this.deleteIssueHistory(deleteIssue.id);

    this.logger.log(`Issue history deleted for issue ${deleteIssue.id}`);

    return deleteIssue;
  }

  private async upsertIssueHistory(
    issue: Issue,
    currentIssue: Issue | null,
    userId?: string,
    linkMetaData?: Record<string, string>,
    issueRelation?: RelationInput,
  ): Promise<void> {
    this.logger.log(`Upserting issue history for issue ${issue.id}`);
    await this.issueHistoryService.upsertIssueHistory(
      userId,
      issue.id,
      await getIssueDiff(issue, currentIssue),
      linkMetaData,
    );

    if (issueRelation) {
      this.logger.log(`Creating issue relation for issue ${issue.id}`);

      const relationInput: IssueRelationInput = {
        issueId: issueRelation.issueId || issue.id,
        relatedIssueId: issueRelation.relatedIssueId || issue.id,
        type: issueRelation.type,
      };

      await this.issueRelationService.createIssueRelation(
        userId,
        relationInput,
      );
    }
  }

  private async deleteIssueHistory(issueId: string): Promise<void> {
    this.logger.log(`Deleting issue history for issue ${issueId}`);
    await this.issueHistoryService.deleteIssueHistory(issueId);
  }
}
