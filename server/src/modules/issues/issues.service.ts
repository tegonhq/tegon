/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { Issue } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  CreateIssueInput,
  IssueRequestParams,
  TeamRequestParams,
  UpdateIssueInput,
} from './issue.interface';

@Injectable()
export default class IssuesService {
  constructor(private prisma: PrismaService) {}

  async createIssue(
    teamRequestParams: TeamRequestParams,
    userId: string,
    issueData: CreateIssueInput,
  ): Promise<Issue> {
    const { parentId, ...otherIssueData } = issueData;
    const lastNumber = (await this.prisma.issue.findFirst({
      where: { teamId: teamRequestParams.teamId },
      orderBy: { number: 'desc' },
    }))?.number ?? 0;

    return await this.prisma.issue.create({
      data: {
        ...otherIssueData,
        createdBy: { connect: { id: userId } },
        team: { connect: { id: teamRequestParams.teamId } },
        number: lastNumber+1,
        ...(parentId && { parent: { connect: { id: parentId } } }),
      },
    });
  }

  async updateIssue(
    teamRequestParams: TeamRequestParams,
    issueData: UpdateIssueInput,
    issueParams: IssueRequestParams,
  ): Promise<Issue> {
    return await this.prisma.issue.update({
      where: {
        id: issueParams.issueId,
        teamId: teamRequestParams.teamId,
      },
      data: {
        ...issueData,
      },
    });
  }

  async deleteIssue(
    teamRequestParams: TeamRequestParams,
    issueParams: IssueRequestParams,
  ): Promise<Issue> {
    return await this.prisma.issue.update({
      where: {
        id: issueParams.issueId,
        teamId: teamRequestParams.teamId,
      },
      data: {
        deleted: Date(),
      },
    });
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
