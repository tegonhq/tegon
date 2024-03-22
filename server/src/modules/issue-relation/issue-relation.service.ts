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
    const [issueRelation] = await Promise.all([
      this.prisma.issueRelation.create({
        data: {
          createdById: userId,
          ...relationData,
        },
      }),
      this.prisma.issueRelation.create({
        data: {
          createdById: userId,
          issueId: relationData.relatedIssueId,
          relatedIssueId: relationData.issueId,
          type: ReverseIssueRelationType[relationData.type],
        },
      }),
    ]);

    return issueRelation;
  }

  async deleteIssueRelation(
    userId: string,
    issueRelationId: IssueRelationIdRequestParams,
  ): Promise<IssueRelation> {
    const deletedAt = new Date().toISOString();

    const issueRelationData: IssueRelation =
      await this.prisma.issueRelation.update({
        where: { id: issueRelationId.issueRelationId },
        data: { deletedAt, deletedById: userId },
      });

    await this.prisma.issueRelation.update({
      where: {
        issueId_relatedIssueId_type: {
          issueId: issueRelationData.relatedIssueId,
          relatedIssueId: issueRelationData.issueId,
          type: ReverseIssueRelationType[issueRelationData.type],
        },
      },
      data: { deletedAt, deletedById: userId },
    });

    return issueRelationData;
  }
}
