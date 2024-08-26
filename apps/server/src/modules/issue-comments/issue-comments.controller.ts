import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Query,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  CreateIssueCommentDto,
  CreateIssueCommentRequestParamsDto,
  IssueComment,
  IssueCommentRequestParamsDto,
} from '@tegonhq/types';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

import {
  ReactionInput,
  ReactionRequestParams,
} from './issue-comments.interface';
import IssueCommentsService from './issue-comments.service';

@Controller({
  version: '1',
  path: 'issue_comments',
})
export class IssueCommentsController {
  constructor(private issueCommentsService: IssueCommentsService) {}

  @Get('linked_comment')
  @UseGuards(AuthGuard)
  async getLinkedComment(@Query('sourceId') sourceId: string) {
    return await this.issueCommentsService.getLinkedCommentBySource(sourceId);
  }

  @Post('linked_comment')
  @UseGuards(AuthGuard)
  async createLinkedComment(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Body() createLinkedCommentInput: any,
  ) {
    return await this.issueCommentsService.createLinkedComment(
      createLinkedCommentInput,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async createIssueComment(
    @SessionDecorator() session: SessionContainer,
    @Query() issueParams: CreateIssueCommentRequestParamsDto,
    @Body() commentData: CreateIssueCommentDto,
  ): Promise<IssueComment> {
    const userId = session.getUserId();
    return await this.issueCommentsService.createIssueComment(
      issueParams,
      userId,
      commentData,
    );
  }

  @Get(':issueCommentId')
  @UseGuards(AuthGuard)
  async getIssueComment(
    @Param() issueCommentParams: IssueCommentRequestParamsDto,
  ): Promise<IssueComment> {
    return await this.issueCommentsService.getIssueComment(issueCommentParams);
  }

  @Post(':issueCommentId')
  @UseGuards(AuthGuard)
  async updateIssueComment(
    @Param() issueCommentParams: IssueCommentRequestParamsDto,
    @Body() commentData: CreateIssueCommentDto,
  ): Promise<IssueComment> {
    return await this.issueCommentsService.updateIssueComment(
      issueCommentParams,
      commentData,
    );
  }

  @Delete(':issueCommentId')
  @UseGuards(AuthGuard)
  async deleteIssueComment(
    @Param() issueCommentParams: IssueCommentRequestParamsDto,
  ): Promise<IssueComment> {
    return await this.issueCommentsService.deleteIssueComment(
      issueCommentParams,
    );
  }

  @Post(':issueCommentId/reaction')
  @UseGuards(AuthGuard)
  async createCommentReaction(
    @SessionDecorator() session: SessionContainer,
    @Param() issueCommentParams: IssueCommentRequestParamsDto,
    @Body() reactionData: ReactionInput,
  ): Promise<IssueComment> {
    const userId = session.getUserId();
    return await this.issueCommentsService.createCommentReaction(
      userId,
      issueCommentParams,
      reactionData,
    );
  }

  @Delete(':issueCommentId/reaction/:reactionId')
  @UseGuards(AuthGuard)
  async deleteCommentReaction(
    @Param() reactionParams: ReactionRequestParams,
  ): Promise<IssueComment> {
    return await this.issueCommentsService.deleteCommentReaction(
      reactionParams,
    );
  }
}
