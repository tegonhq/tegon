/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IssueHistory } from '@prisma/client';

import { AuthGuard } from 'modules/auth/auth.guard';

import { IssueHistoryIdRequestParams } from './issue-history.interface';
import IssuesHistoryService from './issue-history.service';

@Controller({
  version: '1',
  path: 'issue_history',
})
@ApiTags('Issue History')
export class IssueHistoryController {
  constructor(private issueHistory: IssuesHistoryService) {}

  @Delete(':issueHistoryId')
  @UseGuards(new AuthGuard())
  async deleteLabel(
    @Param()
    issueHistoryId: IssueHistoryIdRequestParams,
  ): Promise<IssueHistory> {
    return await this.issueHistory.deleteIssueRelation(issueHistoryId);
  }
}
