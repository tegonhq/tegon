/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { Issue } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import OpenAI from 'openai';

import IssuesHistoryService from 'modules/issue-history/issue-history.service';

import {
  CreateIssueInput,
  IssueRequestParams,
  LinkIssueData,
  TeamRequestParams,
  UpdateIssueInput,
  // UpdateLinkIssueData,
} from './issues.interface';
import { getIssueDiff, getIssueTitle } from './issues.utils';

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
    const lastNumber =
      (
        await this.prisma.issue.findFirst({
          where: { teamId: teamRequestParams.teamId },
          orderBy: { number: 'desc' },
        })
      )?.number ?? 0;

    let issueTitle;
    if (!issueData.title) {
      issueTitle = await getIssueTitle(
        openaiClient,
        otherIssueData.description,
      );
    } else {
      issueTitle = issueData.title;
    }

    const issue = await this.prisma.issue.create({
      data: {
        title: issueTitle,
        ...otherIssueData,
        team: { connect: { id: teamRequestParams.teamId } },
        number: lastNumber + 1,
        ...(userId && { createdBy: { connect: { id: userId } } }),
        ...(parentId && { parent: { connect: { id: parentId } } }),
        ...(linkIssuedata && {
          linkedIssues: { create: { ...linkIssuedata } },
        }),
        ...(linkMetaData && { sourceMetadata: { ...linkMetaData } }),
      },
    });

    await this.issueHistoryService.upsertIssueHistory(
      userId,
      issue.id,
      await getIssueDiff(issue, null),
      linkMetaData,
    );

    return issue;
  }

  async updateIssue(
    teamRequestParams: TeamRequestParams,
    issueData: UpdateIssueInput,
    issueParams: IssueRequestParams,
    userId?: string,
    linkIssuedata?: LinkIssueData,
    linkMetaData?: Record<string, string>
  ): Promise<Issue> {
    const { parentId, ...otherIssueData } = issueData;

    let issueTitle;
    if (!issueData.title && issueData.description) {
      issueTitle = await getIssueTitle(
        openaiClient,
        otherIssueData.description,
      );
    } else if (issueData.title) {
      issueTitle = otherIssueData.title;
    }

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
          ...(issueTitle && {title: issueTitle}),
          ...(parentId && { parent: { connect: { id: parentId } } }),
          ...(linkIssuedata && {
            linkedIssues: {
              upsert: {
                where: { url: linkIssuedata.url },
                update: { ...linkIssuedata },
                create: { ...linkIssuedata },
              },
            },
          }),
        },
      }),
    ]);

    await this.issueHistoryService.upsertIssueHistory(
      userId,
      updatedIssue.id,
      await getIssueDiff(updatedIssue, currentIssue),
      linkMetaData
    );

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

    await this.issueHistoryService.deleteIssueHistory(deleteIssue.id);
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
}
