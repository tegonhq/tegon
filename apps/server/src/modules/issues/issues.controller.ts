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
import {
  CreateIssueDto,
  CreateLinkedIssueDto,
  Issue,
  IssueRequestParamsDto,
  TeamRequestParamsDto,
  UpdateIssueDto,
  WorkspaceRequestParamsDto,
  GetIssuesByFilterDTO,
  LinkedIssue,
} from '@tegonhq/types';
import { Response } from 'express';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';
import { AdminGuard } from 'modules/users/admin.guard';

import { ApiResponse, SubscribeIssueInput } from './issues.interface';
import IssuesService from './issues.service';

@Controller({
  version: '1',
  path: 'issues',
})
export class IssuesController {
  constructor(
    private issuesService: IssuesService,
    private linkedIssueService: LinkedIssueService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createIssue(
    @SessionDecorator() session: SessionContainer,
    @Body() issueData: CreateIssueDto,
  ): Promise<Issue> {
    const userId = session.getUserId();
    return await this.issuesService.createIssueAPI(issueData, userId);
  }

  @Post('bulk/update')
  @UseGuards(AuthGuard)
  async bulkUpdateIssues(
    @SessionDecorator() session: SessionContainer,
    @Query() teamParams: TeamRequestParamsDto,
    @Body() issueData: { issues: UpdateIssueDto[] },
  ): Promise<Issue[]> {
    const userId = session.getUserId();
    const issues = [];

    for (const issue of issueData.issues) {
      const { issueId, ...otherData } = issue;
      const responseIssue = await this.issuesService.updateIssueApi(
        teamParams,
        otherData,
        { issueId },
        userId,
      );
      issues.push(responseIssue);
    }

    return issues;
  }

  @Post('bulk')
  @UseGuards(AuthGuard)
  async bulkCreateIssues(
    @SessionDecorator() session: SessionContainer,
    @Body() issueData: { issues: CreateIssueDto[] },
  ): Promise<Issue[]> {
    const userId = session.getUserId();
    const issues = [];

    for (const issue of issueData.issues) {
      const responseIssue = await this.issuesService.createIssueAPI(
        issue,
        userId,
      );
      issues.push(responseIssue);
    }

    return issues;
  }

  @Post('filter')
  @UseGuards(AuthGuard)
  async getIssuesByFilter(
    @Body() filterData: GetIssuesByFilterDTO,
  ): Promise<Issue[]> {
    return await this.issuesService.getIssuesByFilter(filterData);
  }

  @Post(':issueId')
  @UseGuards(AuthGuard)
  async updateIssue(
    @SessionDecorator() session: SessionContainer,
    @Param() issueParams: IssueRequestParamsDto,
    @Query() teamParams: TeamRequestParamsDto,
    @Body() issueData: UpdateIssueDto,
  ): Promise<Issue | ApiResponse> {
    const userId = session.getUserId();
    return await this.issuesService.updateIssueApi(
      teamParams,
      issueData,
      issueParams,
      userId,
    );
  }

  @Delete(':issueId')
  @UseGuards(AuthGuard, AdminGuard)
  async deleteIssue(
    @Param() issueParams: IssueRequestParamsDto,
    @Query() teamParams: TeamRequestParamsDto,
  ): Promise<Issue> {
    return await this.issuesService.deleteIssue(teamParams, issueParams);
  }

  @Post(':issueId/link')
  @UseGuards(AuthGuard)
  async linkIssue(
    @SessionDecorator() session: SessionContainer,
    @Param() issueParams: IssueRequestParamsDto,
    @Body() linkData: CreateLinkedIssueDto,
  ): Promise<LinkedIssue | ApiResponse> {
    const userId = session.getUserId();
    return await this.linkedIssueService.createLinkIssue(
      linkData,
      issueParams,
      userId,
    );
  }

  @Post(':issueId/subscribe')
  @UseGuards(AuthGuard)
  async subscribeIssue(
    @SessionDecorator() session: SessionContainer,
    @Param() issueParams: IssueRequestParamsDto,
    @Body() subscriberData: SubscribeIssueInput,
  ) {
    const userId = session.getUserId();
    return await this.issuesService.handleSubscription(
      userId,
      issueParams.issueId,
      subscriberData.type,
    );
  }

  @Post(':issueId/move')
  @UseGuards(AuthGuard)
  async moveIssue(
    @SessionDecorator() session: SessionContainer,
    @Param() issueParams: IssueRequestParamsDto,
    @Body() moveData: TeamRequestParamsDto,
  ): Promise<Issue> {
    const userId = session.getUserId();
    return await this.issuesService.moveIssue(
      userId,
      issueParams.issueId,
      moveData.teamId,
    );
  }

  @Get('export')
  @UseGuards(AuthGuard)
  async exportIssues(
    @Query() workspaceParams: WorkspaceRequestParamsDto,
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

  @Get('number/:issueNumber')
  @UseGuards(AuthGuard)
  async getIssueByNumber(
    @Query() teamParams: TeamRequestParamsDto,
    @Param('issueNumber') issueNumber: string,
  ): Promise<Issue> {
    return await this.issuesService.getIssueByNumber(
      issueNumber,
      teamParams.teamId,
    );
  }

  @Get(':issueId')
  @UseGuards(AuthGuard)
  async getIssue(@Param() issueParams: IssueRequestParamsDto): Promise<Issue> {
    return await this.issuesService.getIssueById(issueParams);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getIssues(@Query('issueIds') issueIds: string[]): Promise<Issue[]> {
    return await this.issuesService.getIssues(issueIds);
  }
}
