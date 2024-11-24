import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  Conversation,
  ConversationParamsDto,
  CreateConversationDto,
} from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';
import { UserId, Workspace } from 'modules/auth/session.decorator';

import { ConversationService } from './conversation.service';

@Controller({
  version: '1',
  path: 'conversations',
})
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createConversation(
    @Workspace() workspaceId: string,
    @UserId() userId: string,
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    return await this.conversationService.createConversation(
      workspaceId,
      userId,
      createConversationDto,
    );
  }

  @Get(':conversationId')
  @UseGuards(AuthGuard)
  async getConversation(
    @Param() conversationParams: ConversationParamsDto,
  ): Promise<Conversation> {
    return await this.conversationService.getConversation(
      conversationParams.conversationId,
    );
  }

  @Delete(':conversationId')
  @UseGuards(AuthGuard)
  async deleteConversation(
    @Param() conversationParams: ConversationParamsDto,
  ): Promise<Conversation> {
    return await this.conversationService.deleteConversation(
      conversationParams.conversationId,
    );
  }
}
