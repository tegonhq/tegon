/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  LinkedIssueIdParams,
  UpdateLinkedIssueData,
} from './linked-issue.interface';
import { AuthGuard } from 'modules/auth/auth.guard';
import { LinkedIssue } from '@prisma/client';
import LinkedIssueService from './linked-issue.service';
import { ApiResponse } from 'modules/issues/issues.interface';

@Controller({
  version: '1',
  path: 'linked-issue',
})
@ApiTags('Linked Issue')
export class LinkedIssueController {
  constructor(private linkedIssueService: LinkedIssueService) {}

  @Post(':linkedIssueId')
  @UseGuards(new AuthGuard())
  async updateLinkedIssue(
    @Param() linkedIssueIdParams: LinkedIssueIdParams,
    @Body() linkedIssueData: UpdateLinkedIssueData,
  ): Promise<LinkedIssue | ApiResponse> {
    return await this.linkedIssueService.updateLinkIssue(
      linkedIssueIdParams,
      linkedIssueData,
    );
  }

  @Delete(':linkedIssueId')
  @UseGuards(new AuthGuard())
  async deleteLinkedIssue(
    @Param() linkedIssueIdParams: LinkedIssueIdParams,
  ): Promise<LinkedIssue> {
    return await this.linkedIssueService.deleteLinkIssue(linkedIssueIdParams);
  }
}
