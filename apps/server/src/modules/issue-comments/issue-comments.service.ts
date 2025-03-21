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
import { tasks } from '@trigger.dev/sdk/v3';
import { PrismaService } from 'nestjs-prisma';
import { notificationHandler } from 'trigger/notification';

import {
  convertMarkdownToTiptapJson,
  convertTiptapJsonToMarkdown,
} from 'common/utils/tiptap.utils';

import IssuesService from 'modules/issues/issues.service';

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
  ) {}

  async getIssueComment(issueCommentParams: IssueCommentRequestParamsDto) {
    const issueComment = await this.prisma.issueComment.findUnique({
      where: { id: issueCommentParams.issueCommentId },
      include: { parent: true, linkedComment: true },
    });

    const bodyMarkdown = convertTiptapJsonToMarkdown(issueComment.body);

    return { bodyMarkdown, ...issueComment };
  }

  async getReplyComments(issueCommentParams: IssueCommentRequestParamsDto) {
    // Get all comments that have this comment as their parent
    const replyComments = await this.prisma.issueComment.findMany({
      where: {
        parentId: issueCommentParams.issueCommentId,
        deleted: null,
      },
      include: {
        parent: true,
        linkedComment: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Convert body to markdown for each reply
    const repliesWithMarkdown = replyComments.map((comment) => ({
      ...comment,
      bodyMarkdown: convertTiptapJsonToMarkdown(comment.body),
    }));

    return repliesWithMarkdown;
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
    const mentionedUserIds = extractMentionedUserIds(updatedBody);
    const subscribersToAdd = [...new Set([userId, ...mentionedUserIds])];

    this.issuesService.updateSubscribers(
      issueRequestParams.issueId,
      subscribersToAdd,
    );

    tasks.trigger<typeof notificationHandler>('notification', {
      event: ActionTypesEnum.ON_CREATE,
      notificationType: NotificationEventFrom.NewComment,
      notificationData: {
        subscriberIds: issueComment.issue.subscriberIds,
        issueCommentId: issueComment.id,
        issueId: issueComment.issueId,
        workspaceId: issueComment.issue.team.workspaceId,
        userId,
      },
    });

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

function extractMentionedUserIds(body: string): string[] {
  try {
    const parsedBody = JSON.parse(body);
    const mentions: string[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const traverse = (node: any) => {
      if (node.type === 'mention' && node.attrs?.id) {
        mentions.push(node.attrs.id);
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };

    traverse(parsedBody);
    return mentions;
  } catch (error) {
    console.error('Error parsing body for mentions:', error);
    return [];
  }
}
