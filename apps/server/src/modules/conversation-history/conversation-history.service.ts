import { Injectable } from '@nestjs/common';
import {
  ConversationContext,
  ConversationHistory,
  CreateConversationHistoryDto,
  Issue,
  Project,
  UpdateConversationHistoryDto,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ConversationHistoryService {
  constructor(private prisma: PrismaService) {}

  async createConversationHistory(
    conversationHistoryData: CreateConversationHistoryDto,
  ): Promise<ConversationHistory> {
    const { conversationId, userId, ...otherData } = conversationHistoryData;
    return this.prisma.conversationHistory.create({
      data: {
        ...otherData,
        ...(userId && {
          user: {
            connect: { id: userId },
          },
        }),
        conversation: {
          connect: { id: conversationId },
        },
      },
    });
  }

  async updateConversationHistory(
    conversationHistoryData: UpdateConversationHistoryDto,
    conversationHistoryId: string,
  ): Promise<ConversationHistory> {
    return this.prisma.conversationHistory.update({
      where: { id: conversationHistoryId },
      data: conversationHistoryData,
    });
  }

  async deleteConversationHistory(
    conversationHistoryId: string,
  ): Promise<ConversationHistory> {
    return this.prisma.conversationHistory.update({
      where: { id: conversationHistoryId },
      data: {
        deleted: new Date(),
      },
    });
  }

  async getConversationHistory(
    conversationHistoryId: string,
  ): Promise<ConversationHistory> {
    return this.prisma.conversationHistory.findUnique({
      where: {
        id: conversationHistoryId,
      },
    });
  }

  async getAllConversationHistory(
    conversationId: string,
  ): Promise<ConversationHistory[]> {
    return this.prisma.conversationHistory.findMany({
      where: {
        conversationId,
        deleted: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getConversationContext(
    conversationHistoryId: string,
  ): Promise<ConversationContext> {
    const conversationHistory =
      await this.prisma.conversationHistory.findUnique({
        where: { id: conversationHistoryId },
      });

    if (!conversationHistory) {
      return null;
    }
    // const context =
    //   (conversationHistory.context as ConversationContextIds) || {};

    // Get pages data if pageIds exist
    const issues: Issue[] = [];
    const projects: Project[] = [];

    // Get previous conversation history message and response
    let previousHistory: ConversationHistory[] = null;
    if (conversationHistory.conversationId) {
      const previousMessages = await this.prisma.conversationHistory.findMany({
        where: {
          conversationId: conversationHistory.conversationId,
          id: {
            not: conversationHistoryId,
          },
          deleted: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      previousHistory = previousMessages;
    }

    return {
      issues,
      projects,
      previousHistory,
    };
  }
}
