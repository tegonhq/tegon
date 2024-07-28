import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prompt } from '@prisma/client';

import { AuthGuard } from 'modules/auth/auth.guard';

import { PromptInput } from './prompts.interface';
import PromptsService from './prompts.service';

@Controller({
  version: '1',
  path: 'prompts',
})
@ApiTags('Prompts')
export class PromptsController {
  constructor(private promptsService: PromptsService) {}

  @Get()
  @UseGuards(new AuthGuard())
  async getAllPrompts(
    @Query('workspaceId') workspaceId: string,
  ): Promise<Prompt[]> {
    return await this.promptsService.getAllPrompts(workspaceId);
  }

  @Post()
  @UseGuards(new AuthGuard())
  async createPrompt(
    @Query('workspaceId') workspaceId: string,
    @Body() promptInput: PromptInput,
  ): Promise<Prompt> {
    return await this.promptsService.createPrompt(workspaceId, promptInput);
  }

  @Post(':promptId')
  @UseGuards(new AuthGuard())
  async getPrompt(@Param('promptId') promptId: string): Promise<Prompt> {
    return await this.promptsService.getPrompt(promptId);
  }

  @Post(':promptId')
  @UseGuards(new AuthGuard())
  async updatePrompt(
    @Param('promptId') promptId: string,
    @Body() promptInput: PromptInput,
  ): Promise<Prompt> {
    return await this.promptsService.updatePrompt(promptId, promptInput);
  }

  @Delete(':promptId')
  @UseGuards(new AuthGuard())
  async deletePrompt(@Param('promptId') promptId: string): Promise<Prompt> {
    return await this.promptsService.deletePrompt(promptId);
  }
}
