import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  LinkedIssue,
  LinkedIssueRequestParamsDto,
  UpdateLinkedIssueDto,
} from '@tegonhq/types';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';
import { ApiResponse } from 'modules/issues/issues.interface';

import LinkedIssueService from './linked-issue.service';

@Controller({
  version: '1',
  path: 'linked_issues',
})
export class LinkedIssueController {
  constructor(private linkedIssueService: LinkedIssueService) {}

  @Get('source')
  @UseGuards(AuthGuard)
  async getLinkedIssueBySourceId(@Query('sourceId') sourceId: string) {
    return await this.linkedIssueService.getLinkedIssueBySourceId(sourceId);
  }

  @Get('issue')
  @UseGuards(AuthGuard)
  async getLinkedIssueByIssueId(@Query('issueId') issueId: string) {
    return await this.linkedIssueService.getLinkedIssueByIssueId(issueId);
  }

  @Get(':linkedIssueId')
  @UseGuards(AuthGuard)
  async getLinkedIssue(
    @Param() linkedIssueIdParams: LinkedIssueRequestParamsDto,
  ): Promise<LinkedIssue> {
    return await this.linkedIssueService.getLinkedIssue(
      linkedIssueIdParams.linkedIssueId,
    );
  }

  @Post(':linkedIssueId')
  @UseGuards(AuthGuard)
  async updateLinkedIssue(
    @SessionDecorator() session: SessionContainer,
    @Param() linkedIssueIdParams: LinkedIssueRequestParamsDto,
    @Body() linkedIssueData: UpdateLinkedIssueDto,
  ): Promise<LinkedIssue | ApiResponse> {
    const userId = session.getUserId();

    return await this.linkedIssueService.updateLinkIssue(
      linkedIssueIdParams,
      linkedIssueData,
      userId,
    );
  }

  @Post('source/:sourceId')
  @UseGuards(AuthGuard)
  async updateLinkedIssueBySourceId(
    @SessionDecorator() session: SessionContainer,

    @Param('sourceId') sourceId: string,
    @Body() linkedIssueData: UpdateLinkedIssueDto,
  ) {
    const userId = session.getUserId();

    return await this.linkedIssueService.updateLinkIssueBySource(
      sourceId,
      linkedIssueData,
      userId,
    );
  }

  @Delete(':linkedIssueId')
  @UseGuards(AuthGuard)
  async deleteLinkedIssue(
    @Param() linkedIssueIdParams: LinkedIssueRequestParamsDto,
  ): Promise<LinkedIssue> {
    return await this.linkedIssueService.deleteLinkIssue(linkedIssueIdParams);
  }
}
