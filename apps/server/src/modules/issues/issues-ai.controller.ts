import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IssueRequestParamsDto, TeamRequestParamsDto } from '@tegonhq/types';
import { Response } from 'express';

import { AuthGuard } from 'modules/auth/auth.guard';

import IssuesAIService from './issues-ai.service';
import {
  AIInput,
  DescriptionInput,
  FilterInput,
  SubIssueInput,
} from './issues.interface';

@Controller({
  version: '1',
  path: 'issues/ai',
})
export class IssuesAIController {
  constructor(private issuesAiService: IssuesAIService) {}

  @Post('suggestions')
  @UseGuards(AuthGuard)
  async suggestions(
    @Query() teamRequestParams: TeamRequestParamsDto,
    @Body() suggestionsInput: AIInput,
  ) {
    return await this.issuesAiService.suggestions(
      teamRequestParams,
      suggestionsInput,
    );
  }

  @Post('ai_filters')
  @UseGuards(AuthGuard)
  async aiFilters(
    @Query() teamRequestParams: TeamRequestParamsDto,
    @Body() filterInput: FilterInput,
  ) {
    return await this.issuesAiService.aiFilters(teamRequestParams, filterInput);
  }

  @Post('ai_title')
  @UseGuards(AuthGuard)
  async aiTitle(@Body() aiInput: AIInput) {
    return await this.issuesAiService.aiTitle(aiInput);
  }

  @Post('subissues/generate')
  @UseGuards(AuthGuard)
  async generateSubIssues(@Body() issueInput: SubIssueInput) {
    return await this.issuesAiService.generateSubIssues(issueInput);
  }

  @Post('stream/description')
  @UseGuards(AuthGuard)
  async generateDescriptionStream(
    @Body() descriptionInput: DescriptionInput,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.issuesAiService.getDescriptionStream(descriptionInput, response);
  }

  @Get(':issueId/summarize')
  @UseGuards(AuthGuard)
  async summarizeIssue(@Param() issueParams: IssueRequestParamsDto) {
    return await this.issuesAiService.summarizeIssue(issueParams.issueId);
  }
}
