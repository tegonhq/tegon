/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Issue } from '@prisma/client';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

import {
  CreateIssueInput,
  IssueRequestParams,
  LinkIssueInput,
  TeamRequestParams,
  UpdateIssueInput,
} from './issues.interface';
import IssuesService from './issues.service';

@Controller({
  version: '1',
  path: 'issues',
})
@ApiTags('Issues')
export class IssuesController {
  constructor(private issuesService: IssuesService) {}

  @Post()
  @UseGuards(new AuthGuard())
  async createIssue(
    @SessionDecorator() session: SessionContainer,
    @Query() teamParams: TeamRequestParams,
    @Body() issueData: CreateIssueInput,
  ): Promise<Issue> {
    const userId = session.getUserId();
    return await this.issuesService.createIssue(teamParams, issueData, userId);
  }

  @Post(':issueId')
  @UseGuards(new AuthGuard())
  async updateIssue(
    @SessionDecorator() session: SessionContainer,
    @Param() issueParams: IssueRequestParams,
    @Query() teamParams: TeamRequestParams,
    @Body() issueData: UpdateIssueInput,
  ): Promise<Issue> {
    const userId = session.getUserId();
    return await this.issuesService.updateIssue(
      teamParams,
      issueData,
      issueParams,
      userId,
    );
  }

  @Delete(':issueId')
  @UseGuards(new AuthGuard())
  async deleteIssue(
    @Param() issueParams: IssueRequestParams,
    @Query() teamParams: TeamRequestParams,
  ): Promise<Issue> {
    return await this.issuesService.deleteIssue(teamParams, issueParams);
  }

  @Post(':issueId/link')
  @UseGuards(new AuthGuard())
  async linkIssue(
    @SessionDecorator() session: SessionContainer,
    @Param() issueParams: IssueRequestParams,
    @Query() teamParams: TeamRequestParams,
    @Body() linkData: LinkIssueInput,
  ) {
    const userId = session.getUserId();
    return await this.issuesService.createLinkIssue(
      teamParams,
      linkData,
      issueParams,
      userId,
    );
  }
}
