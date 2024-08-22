import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetAIRequestDTO } from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';

import AIRequestsService from './ai-requests.services';

@Controller({
  version: '1',
  path: 'ai_requests',
})
export class AIRequestsController {
  constructor(private aiRequestsService: AIRequestsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async getLLMRequest(@Body() aiRequestInput: GetAIRequestDTO) {
    return await this.aiRequestsService.getLLMRequest(aiRequestInput);
  }

  @Post('stream')
  @UseGuards(AuthGuard)
  async getLLMRequestStream(@Body() aiRequestInput: GetAIRequestDTO) {
    return await this.aiRequestsService.getLLMRequestStream(aiRequestInput);
  }
}
