/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { Issue } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import OpenAI from 'openai';

import IssuesHistoryService from 'modules/issue-history/issue-history.service';

import {
  CreateIssueInput,
  IssueRequestParams,
  TeamRequestParams,
  UpdateIssueInput,
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
    userId: string,
    issueData: CreateIssueInput,
  ): Promise<Issue> {
    const { parentId, ...otherIssueData } = issueData;
    const lastNumber =
      (
        await this.prisma.issue.findFirst({
          where: { teamId: teamRequestParams.teamId },
          orderBy: { number: 'desc' },
        })
      )?.number ?? 0;

    const issueTitle = await getIssueTitle(
      openaiClient,
      otherIssueData.description,
    );

    const issue = await this.prisma.issue.create({
      data: {
        title: issueTitle,
        ...otherIssueData,
        createdBy: { connect: { id: userId } },
        team: { connect: { id: teamRequestParams.teamId } },
        number: lastNumber + 1,
        ...(parentId && { parent: { connect: { id: parentId } } }),
      },
    });

    await this.issueHistoryService.upsertIssueHistory(
      userId,
      issue.id,
      await getIssueDiff(issue, null),
    );

    return issue;
  }

  async updateIssue(
    userId: string,
    teamRequestParams: TeamRequestParams,
    issueData: UpdateIssueInput,
    issueParams: IssueRequestParams,
  ): Promise<Issue> {
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
          ...issueData,
        },
      }),
    ]);

    await this.issueHistoryService.upsertIssueHistory(
      userId,
      updatedIssue.id,
      await getIssueDiff(updatedIssue, currentIssue),
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
