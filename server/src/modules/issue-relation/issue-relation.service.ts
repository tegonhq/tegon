/* eslint-disable @typescript-eslint/no-unused-vars */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { IssueRelation } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  IssueRelationIdRequestParams,
  IssueRelationInput,
  ReverseIssueRelationType,
} from './issue-relation.interface';

@Injectable()
export default class IssueRelationService {
  constructor(private prisma: PrismaService) {}

  async createIssueRelation(
    userId: string,
    relationData: IssueRelationInput,
  ): Promise<IssueRelation> {
    const issueRelationData = await this.prisma.issueRelation.upsert({
      where: {
        issueId_relatedIssueId_type: {
          issueId: relationData.issueId,
          relatedIssueId: relationData.relatedIssueId,
          type: relationData.type,
        },
      },
      update: {
        deleted: null,
      },
      create: {
        createdById: userId,
        ...relationData,
      },
    });

    await this.prisma.issueRelation.upsert({
      where: {
        issueId_relatedIssueId_type: {
          issueId: relationData.relatedIssueId,
          relatedIssueId: relationData.issueId,
          type: ReverseIssueRelationType[relationData.type],
        },
      },
      update: {
        deleted: null,
      },
      create: {
        createdById: userId,
        issueId: relationData.relatedIssueId,
        relatedIssueId: relationData.issueId,
        type: ReverseIssueRelationType[relationData.type],
      },
    });

    await this.createIssueHistory(userId, issueRelationData);

    return issueRelationData;
  }

  async deleteIssueRelation(
    userId: string,
    issueRelationId: IssueRelationIdRequestParams,
  ): Promise<IssueRelation> {
    const deleted = new Date().toISOString();

    const issueRelationData = await this.prisma.issueRelation.update({
      where: { id: issueRelationId.issueRelationId },
      data: { deleted, deletedById: userId },
    });

    await this.prisma.issueRelation.update({
      where: {
        issueId_relatedIssueId_type: {
          issueId: issueRelationData.relatedIssueId,
          relatedIssueId: issueRelationData.issueId,
          type: ReverseIssueRelationType[issueRelationData.type],
        },
      },
      data: { deleted, deletedById: userId },
    });

    await this.createIssueHistory(userId, issueRelationData, true);

    return issueRelationData;
  }

  async createIssueHistory(
    userId: string,
    issueRelation: IssueRelation,
    isDeleted?: boolean,
  ) {
    await this.prisma.issueHistory.createMany({
      data: [
        {
          issueId: issueRelation.issueId,
          userId,
          relationChanges: {
            issueId: issueRelation.issueId,
            relatedIssueId: issueRelation.relatedIssueId,
            type: issueRelation.type,
            ...(isDeleted !== undefined && { isDeleted }),
          },
        },
        {
          issueId: issueRelation.relatedIssueId,
          userId,
          relationChanges: {
            issueId: issueRelation.relatedIssueId,
            relatedIssueId: issueRelation.issueId,
            type: ReverseIssueRelationType[issueRelation.type],
            ...(isDeleted !== undefined && { isDeleted }),
          },
        },
      ],
    });
  }
}
