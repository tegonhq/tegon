import { PrismaService } from 'nestjs-prisma';

import { LoggerService } from 'modules/logger/logger.service';

import { PromptInput } from './prompts.interface';

export default class PromptsService {
  private readonly logger: LoggerService = new LoggerService('PromptsService');
  constructor(private prisma: PrismaService) {}

  async getAllPrompts(workspaceId: string) {
    this.logger.debug({
      message: `Fetching all prompts for this workspace ${workspaceId}`,
      where: `PromptsService.getAllPrompts`,
    });
    return await this.prisma.prompt.findMany({ where: { workspaceId } });
  }

  async createPrompt(workspaceId: string, promptInput: PromptInput) {
    return await this.prisma.prompt.create({
      data: { workspaceId, ...promptInput },
    });
  }

  async updatePrompt(promptId: string, promptInput: PromptInput) {
    return await this.prisma.prompt.update({
      where: { id: promptId },
      data: { ...promptInput },
    });
  }

  async deletePrompt(promptId: string) {
    return await this.prisma.prompt.update({
      where: { id: promptId },
      data: { deleted: new Date().toISOString() },
    });
  }

  async getPrompt(promptId: string) {
    return await this.prisma.prompt.findUnique({ where: { id: promptId } });
  }
}
