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
import { ApiTags } from '@nestjs/swagger';
import {
  LinkedIssue,
  LinkedIssueRequestParamsDto,
  UpdateLinkedIssueDto,
} from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';
import { ApiResponse } from 'modules/issues/issues.interface';

import LinkedIssueService from './linked-issue.service';

@Controller({
  version: '1',
  path: 'linked_issues',
})
@ApiTags('Linked Issue')
export class LinkedIssueController {
  constructor(private linkedIssueService: LinkedIssueService) {}

  @Get('source')
  @UseGuards(new AuthGuard())
  async getLinkedIssueBySourceId(@Query('sourceId') sourceId: string) {
    return await this.linkedIssueService.getLinkedIssueBySourceId(sourceId);
  }

  @Get(':linkedIssueId')
  @UseGuards(new AuthGuard())
  async getLinkedIssue(
    @Param() linkedIssueIdParams: LinkedIssueRequestParamsDto,
  ): Promise<LinkedIssue> {
    return await this.linkedIssueService.getLinkedIssue(
      linkedIssueIdParams.linkedIssueId,
    );
  }

  @Post(':linkedIssueId')
  @UseGuards(new AuthGuard())
  async updateLinkedIssue(
    @Param() linkedIssueIdParams: LinkedIssueRequestParamsDto,
    @Body() linkedIssueData: UpdateLinkedIssueDto,
  ): Promise<LinkedIssue | ApiResponse> {
    return await this.linkedIssueService.updateLinkIssue(
      linkedIssueIdParams,
      linkedIssueData,
    );
  }

  @Post('source/:sourceId')
  @UseGuards(new AuthGuard())
  async updateLinkedIssueBySourceId(
    @Param('sourceId') sourceId: string,
    @Body() linkedIssueData: UpdateLinkedIssueDto,
  ) {
    return await this.linkedIssueService.updateLinkIssueBySource(
      sourceId,
      linkedIssueData,
    );
  }

  @Delete(':linkedIssueId')
  @UseGuards(new AuthGuard())
  async deleteLinkedIssue(
    @Param() linkedIssueIdParams: LinkedIssueRequestParamsDto,
  ): Promise<LinkedIssue> {
    return await this.linkedIssueService.deleteLinkIssue(linkedIssueIdParams);
  }
}
