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
import { IssueComment } from '@prisma/client';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

import {
  CommentInput,
  IssueCommentRequestParams,
  IssueRequestParams,
  ReactionInput,
  ReactionRequestParams,
} from './issue-comments.interface';
import IssueCommentsService from './issue-comments.service';

@Controller({
  version: '1',
  path: 'issue-comments',
})
@ApiTags('issue-comments')
export class IssueCommentsController {
  constructor(private issueCommentsService: IssueCommentsService) {}

  @Post()
  @UseGuards(new AuthGuard())
  async createIssueComment(
    @SessionDecorator() session: SessionContainer,
    @Query() issueParams: IssueRequestParams,
    @Body() commentData: CommentInput,
  ): Promise<IssueComment> {
    const userId = session.getUserId();
    return await this.issueCommentsService.createIssueComment(
      issueParams,
      userId,
      commentData,
    );
  }

  @Post(':issueCommentId')
  @UseGuards(new AuthGuard())
  async updateIssueComment(
    @Param() issueCommentParams: IssueCommentRequestParams,
    @Body() commentData: CommentInput,
  ): Promise<IssueComment> {
    return await this.issueCommentsService.updateIssueComment(
      issueCommentParams,
      commentData,
    );
  }

  @Delete(':issueCommentId')
  @UseGuards(new AuthGuard())
  async deleteIssueComment(
    @Param() issueCommentParams: IssueCommentRequestParams,
  ): Promise<IssueComment> {
    return await this.issueCommentsService.deleteIssueComment(
      issueCommentParams,
    );
  }

  @Post(':issueCommentId/reaction')
  @UseGuards(new AuthGuard())
  async createCommentReaction(
    @SessionDecorator() session: SessionContainer,
    @Param() issueCommentParams: IssueCommentRequestParams,
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
  @UseGuards(new AuthGuard())
  async deleteCommentReaction(
    @Param() reactionParams: ReactionRequestParams,
  ): Promise<IssueComment> {
    return await this.issueCommentsService.deleteCommentReaction(
      reactionParams,
    );
  }
}
