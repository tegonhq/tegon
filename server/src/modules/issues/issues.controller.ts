/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Readable } from 'stream';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Issue } from '@prisma/client';
import { Response } from 'express';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';

import {
  ApiResponse,
  CreateIssueInput,
  FilterInput,
  IssueRequestParams,
  LinkIssueInput,
  MoveIssueInput,
  SubscribeIssueInput,
  SuggestionsInput,
  TeamRequestParams,
  UpdateIssueInput,
  WorkspaceQueryParams,
} from './issues.interface';
import IssuesService from './issues.service';

@Controller({
  version: '1',
  path: 'issues',
})
@ApiTags('Issues')
export class IssuesController {
  constructor(
    private issuesService: IssuesService,
    private linkedIssueService: LinkedIssueService,
  ) {}

  @Post()
  @UseGuards(new AuthGuard())
  async createIssue(
    @SessionDecorator() session: SessionContainer,
    @Query() teamParams: TeamRequestParams,
    @Body() issueData: CreateIssueInput,
  ) {
    const userId = session.getUserId();
    return await this.issuesService.createIssue(teamParams, issueData, userId);
  }

  @Post('suggestions')
  @UseGuards(new AuthGuard())
  async suggestions(
    @Query() teamRequestParams: TeamRequestParams,
    @Body() suggestionsInput: SuggestionsInput,
  ) {
    return await this.issuesService.suggestions(
      teamRequestParams,
      suggestionsInput,
    );
  }

  @Post('ai_filters')
  @UseGuards(new AuthGuard())
  async aiFilters(
    @Query() teamRequestParams: TeamRequestParams,
    @Body() filterInput: FilterInput,
  ) {
    return await this.issuesService.aiFilters(teamRequestParams, filterInput);
  }

  @Post(':issueId')
  @UseGuards(new AuthGuard())
  async updateIssue(
    @SessionDecorator() session: SessionContainer,
    @Param() issueParams: IssueRequestParams,
    @Query() teamParams: TeamRequestParams,
    @Body() issueData: UpdateIssueInput,
  ): Promise<Issue | ApiResponse> {
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
    return await this.linkedIssueService.createLinkIssue(
      teamParams,
      linkData,
      issueParams,
      userId,
    );
  }

  @Post(':issueId/subscribe')
  @UseGuards(new AuthGuard())
  async subscribeIssue(
    @SessionDecorator() session: SessionContainer,
    @Param() issueParams: IssueRequestParams,
    @Body() subscriberData: SubscribeIssueInput,
  ) {
    const userId = session.getUserId();
    return await this.issuesService.handleSubscription(
      userId,
      issueParams.issueId,
      subscriberData.type,
    );
  }

  @Get('export')
  @UseGuards(new AuthGuard())
  async exportIssues(
    @Query() workspaceParams: WorkspaceQueryParams,
    @Res() res: Response,
  ): Promise<void> {
    const csvString = await this.issuesService.exportIssues(workspaceParams);

    const csvBuffer = Buffer.from(csvString, 'utf-8');
    const csvStream = new Readable();

    csvStream._read = () => {
      csvStream.push(csvBuffer);
      csvStream.push(null);
    };

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="issues.csv"',
    });

    csvStream.pipe(res);
  }

  @Post(':issueId/move')
  @UseGuards(new AuthGuard())
  async moveIssue(
    @SessionDecorator() session: SessionContainer,
    @Param() issueParams: IssueRequestParams,
    @Body() moveData: MoveIssueInput,
  ) {
    const userId = session.getUserId();
    return await this.issuesService.moveIssue(
      userId,
      issueParams.issueId,
      moveData.teamId,
    );
  }

  @Get(':issueId/summarize')
  @UseGuards(new AuthGuard())
  async summarizeIssue(@Param() issueParams: IssueRequestParams) {
    return await this.issuesService.summarizeIssue(issueParams.issueId);
  }
}
