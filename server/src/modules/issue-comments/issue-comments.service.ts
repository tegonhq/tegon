/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { IssueComment } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import IssuesService from 'modules/issues/issues.service';
import { NotificationEventFrom } from 'modules/notifications/notifications.interface';
import { NotificationsQueue } from 'modules/notifications/notifications.queue';

import {
  CommentInput,
  IssueCommentAction,
  IssueCommentRequestParams,
  IssueRequestParams,
  ReactionInput,
  ReactionRequestParams,
  commentReactionType,
  reactionDataType,
} from './issue-comments.interface';
import { IssueCommentsQueue } from './issue-comments.queue';

@Injectable()
export default class IssueCommentsService {
  constructor(
    private prisma: PrismaService,
    private issueCommentsQueue: IssueCommentsQueue,
    private notificationsQueue: NotificationsQueue,
    private issuesService: IssuesService,
  ) {}

  async createIssueComment(
    issueRequestParams: IssueRequestParams,
    userId: string,
    commentData: CommentInput,
  ): Promise<IssueComment> {
    const issueComment = await this.prisma.issueComment.create({
      data: {
        ...commentData,
        userId,
        issueId: issueRequestParams.issueId,
      },
      include: {
        issue: { include: { team: true } },
        parent: true,
      },
    });

    this.issuesService.updateSubscribers(issueRequestParams.issueId, [userId]);

    await this.issueCommentsQueue.addTwoWaySyncJob(
      issueComment,
      IssueCommentAction.CREATED,
      userId,
    );

    await this.notificationsQueue.addToNotification(
      NotificationEventFrom.NewComment,
      userId,
      {
        subscriberIds: issueComment.issue.subscriberIds,
        issueCommentId: issueComment.id,
        issueId: issueComment.issueId,
        workspaceId: issueComment.issue.team.workspaceId,
      },
    );

    return issueComment;
  }

  async updateIssueComment(
    issueCommentParams: IssueCommentRequestParams,
    commentData: CommentInput,
  ): Promise<IssueComment> {
    const issueComment = await this.prisma.issueComment.update({
      where: {
        id: issueCommentParams.issueCommentId,
      },
      data: commentData,
      include: {
        issue: { include: { team: true } },
        parent: true,
      },
    });

    await this.issueCommentsQueue.addTwoWaySyncJob(
      issueComment,
      IssueCommentAction.UPDATED,
      issueComment.userId,
    );

    return issueComment;
  }

  async deleteIssueComment(
    issueCommentParams: IssueCommentRequestParams,
  ): Promise<IssueComment> {
    const issueComment = await this.prisma.issueComment.update({
      where: {
        id: issueCommentParams.issueCommentId,
      },
      data: {
        deleted: new Date().toISOString(),
      },
      include: {
        issue: { include: { team: true } },
        parent: true,
      },
    });

    await this.issueCommentsQueue.addTwoWaySyncJob(
      issueComment,
      IssueCommentAction.DELETED,
      issueComment.userId,
    );
    return issueComment;
  }

  async createCommentReaction(
    userId: string,
    issueCommentParams: IssueCommentRequestParams,
    reactionInput: ReactionInput,
  ): Promise<IssueComment> {
    const emoji = await this.prisma.emoji.upsert({
      where: { name: reactionInput.emoji },
      update: {},
      create: { name: reactionInput.emoji },
    });
    const reaction = await this.prisma.reaction.upsert({
      where: {
        emojiId_commentId_userId: {
          userId,
          commentId: issueCommentParams.issueCommentId,
          emojiId: emoji.id,
        },
      },
      update: { deleted: null },
      create: {
        userId,
        comment: { connect: { id: issueCommentParams.issueCommentId } },
        emoji: { connect: { id: emoji.id } },
      },
    });

    const issueComment = await this.prisma.issueComment.findUnique({
      where: { id: issueCommentParams.issueCommentId },
    });

    const reactionData = isReactionDataTypeArray(issueComment.reactionsData)
      ? issueComment.reactionsData
      : [];

    const emojiData = reactionData.find(
      (data: reactionDataType) => data.emoji === reactionInput.emoji,
    );

    if (emojiData) {
      emojiData.reactions.push({
        id: reaction.id,
        reactedAt: Date(),
        userId,
      });
    } else {
      reactionData.push({
        emoji: reactionInput.emoji,
        reactions: [
          {
            id: reaction.id,
            reactedAt: Date(),
            userId,
          },
        ],
      });
    }

    return await this.prisma.issueComment.update({
      where: { id: issueCommentParams.issueCommentId },
      data: { reactionsData: reactionData },
    });
  }

  async deleteCommentReaction(
    reactionParams: ReactionRequestParams,
  ): Promise<IssueComment> {
    const response = await this.prisma.reaction.update({
      where: {
        id: reactionParams.reactionId,
      },
      data: {
        deleted: new Date().toISOString(),
      },
      include: {
        emoji: true,
      },
    });

    const issueComment = await this.prisma.issueComment.findUnique({
      where: { id: response.commentId },
    });

    const reactionData = isReactionDataTypeArray(issueComment.reactionsData)
      ? issueComment.reactionsData
      : [];

    const emojiDataIndex = reactionData.findIndex(
      (data: reactionDataType) => data.emoji === response.emoji.name,
    );

    if (emojiDataIndex !== -1) {
      reactionData[emojiDataIndex].reactions = reactionData[
        emojiDataIndex
      ].reactions.filter(
        (reaction) => reaction.id !== reactionParams.reactionId,
      );

      if (reactionData[emojiDataIndex].reactions.length === 0) {
        reactionData.splice(emojiDataIndex, 1);
      }
    }

    return await this.prisma.issueComment.update({
      where: { id: issueComment.id },
      data: { reactionsData: reactionData },
    });
  }
}

function isReactionDataTypeArray(obj: unknown): obj is reactionDataType[] {
  return (
    Array.isArray(obj) &&
    obj.every(
      (item) =>
        typeof item.emoji === 'string' &&
        Array.isArray(item.reactions) &&
        item.reactions.every(
          (reaction: commentReactionType) =>
            typeof reaction.id === 'string' &&
            typeof reaction.reactedAt === 'string' &&
            typeof reaction.userId === 'string',
        ),
    )
  );
}
