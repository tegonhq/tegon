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
import { ApiTags } from '@nestjs/swagger';
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
@ApiTags('Issues-AI')
export class IssuesAIController {
  constructor(private issuesAiService: IssuesAIService) {}

  @Post('suggestions')
  @UseGuards(new AuthGuard())
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
  @UseGuards(new AuthGuard())
  async aiFilters(
    @Query() teamRequestParams: TeamRequestParamsDto,
    @Body() filterInput: FilterInput,
  ) {
    return await this.issuesAiService.aiFilters(teamRequestParams, filterInput);
  }

  @Post('ai_title')
  @UseGuards(new AuthGuard())
  async aiTitle(@Body() aiInput: AIInput) {
    return await this.issuesAiService.aiTitle(aiInput);
  }

  @Post('subissues/generate')
  @UseGuards(new AuthGuard())
  async generateSubIssues(@Body() issueInput: SubIssueInput) {
    return await this.issuesAiService.generateSubIssues(issueInput);
  }

  @Post('stream/description')
  @UseGuards(new AuthGuard())
  async generateDescriptionStream(
    @Body() descriptionInput: DescriptionInput,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.issuesAiService.getDescriptionStream(descriptionInput, response);
  }

  @Get(':issueId/summarize')
  @UseGuards(new AuthGuard())
  async summarizeIssue(@Param() issueParams: IssueRequestParamsDto) {
    return await this.issuesAiService.summarizeIssue(issueParams.issueId);
  }
}
