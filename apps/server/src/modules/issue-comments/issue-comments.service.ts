import { Injectable } from '@nestjs/common';
import {
  ActionTypesEnum,
  CreateIssueCommentDto,
  CreateIssueCommentRequestParamsDto,
  IssueComment,
  IssueCommentRequestParamsDto,
  LinkedComment,
  NotificationEventFrom,
  UpdateIssueCommentDto,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import {
  convertMarkdownToTiptapJson,
  convertTiptapJsonToMarkdown,
} from 'common/utils/tiptap.utils';

import IssuesService from 'modules/issues/issues.service';
import { Env } from 'modules/triggerdev/triggerdev.interface';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';

import {
  ReactionInput,
  ReactionRequestParams,
  commentReactionType,
  reactionDataType,
} from './issue-comments.interface';

@Injectable()
export default class IssueCommentsService {
  constructor(
    private prisma: PrismaService,
    private issuesService: IssuesService,
    private triggerdevService: TriggerdevService,
  ) {}

  async getIssueComment(issueCommentParams: IssueCommentRequestParamsDto) {
    const issueComment = await this.prisma.issueComment.findUnique({
      where: { id: issueCommentParams.issueCommentId },
      include: { parent: true, linkedComment: true },
    });

    const bodyMarkdown = convertTiptapJsonToMarkdown(issueComment.body);

    return { bodyMarkdown, ...issueComment };
  }

  async createIssueComment(
    issueRequestParams: CreateIssueCommentRequestParamsDto,
    userId: string,
    commentData: CreateIssueCommentDto,
  ): Promise<IssueComment> {
    const { linkCommentMetadata, body, bodyMarkdown, ...otherCommentData } =
      commentData;

    const createdByInfo = {
      userId,
      updatedById: userId,
    };

    let updatedBody = body;
    if (!body && bodyMarkdown) {
      updatedBody = JSON.stringify(convertMarkdownToTiptapJson(bodyMarkdown));
    }

    const issueComment = await this.prisma.issueComment.create({
      data: {
        body: updatedBody,
        ...otherCommentData,
        ...createdByInfo,
        issueId: issueRequestParams.issueId,
        ...(linkCommentMetadata && {
          linkedComment: { create: linkCommentMetadata },
        }),
      },
      include: {
        issue: { include: { team: true } },
        parent: true,
      },
    });

    this.issuesService.updateSubscribers(issueRequestParams.issueId, [userId]);

    this.triggerdevService.triggerTaskAsync(
      'common',
      'notification',
      {
        event: ActionTypesEnum.ON_CREATE,
        notificationType: NotificationEventFrom.NewComment,
        notificationData: {
          subscriberIds: issueComment.issue.subscriberIds,
          issueCommentId: issueComment.id,
          issueId: issueComment.issueId,
          workspaceId: issueComment.issue.team.workspaceId,
          userId,
        },
      },
      Env.PROD,
    );

    const newBodyMarkdown = convertTiptapJsonToMarkdown(issueComment.body);
    return { ...issueComment, bodyMarkdown: newBodyMarkdown };
  }

  async updateIssueComment(
    issueCommentParams: IssueCommentRequestParamsDto,
    commentData: UpdateIssueCommentDto,
  ): Promise<IssueComment> {
    const { body, bodyMarkdown, ...otherCommentData } = commentData;
    let updatedBody = body;

    if (!body && bodyMarkdown) {
      updatedBody = JSON.stringify(convertMarkdownToTiptapJson(bodyMarkdown));
    }

    const issueComment = await this.prisma.issueComment.update({
      where: {
        id: issueCommentParams.issueCommentId,
      },
      data: { body: updatedBody, ...otherCommentData },
      include: {
        issue: { include: { team: true } },
        parent: true,
      },
    });

    const newBodyMarkdown = convertTiptapJsonToMarkdown(issueComment.body);
    return { ...issueComment, bodyMarkdown: newBodyMarkdown };
  }

  async deleteIssueComment(
    issueCommentParams: IssueCommentRequestParamsDto,
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

    return issueComment;
  }

  async createCommentReaction(
    userId: string,
    issueCommentParams: IssueCommentRequestParamsDto,
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

  async getLinkedCommentBySource(sourceId: string): Promise<LinkedComment> {
    return this.prisma.linkedComment.findFirst({
      where: { sourceId },
      include: { comment: true },
    });
  }

  async createLinkedComment(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createLinkedCommentInput: any,
  ): Promise<LinkedComment> {
    return this.prisma.linkedComment.create({
      data: createLinkedCommentInput,
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
