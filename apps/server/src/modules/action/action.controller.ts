import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ActionSlugDto,
  CreateActionDto,
  UpdateActionInputsDto,
  WorkspaceRequestParamsDto,
} from '@tegonhq/types';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

import ActionService from './action.service';

@Controller({
  version: '1',
  path: 'action',
})
export class ActionController {
  constructor(private actionService: ActionService) {}

  @Post('create-resource')
  @UseGuards(AuthGuard)
  async createResource(
    @SessionDecorator() session: SessionContainer,
    @Body() actionCreateResource: CreateActionDto,
  ) {
    const userId = session.getUserId();

    return await this.actionService.createResource(
      actionCreateResource,
      userId,
    );
  }

  @Get(':slug/runs')
  async getRunsForSlug(@Param() slugDto: { slug: string }) {
    return await this.actionService.getRunsForSlug(slugDto.slug);
  }

  @Get(':slug/runs/:runId')
  async getRunForSlug(@Param() slugDto: { slug: string; runId: string }) {
    return await this.actionService.getRunForSlug(slugDto.slug, slugDto.runId);
  }

  @Post(':slug/run')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async run(@Param() slugDto: { slug: string }, @Body() payload: any) {
    return await this.actionService.run(slugDto.slug, payload);
  }

  @Get('source')
  async getExternalActions() {
    return await this.actionService.getExternalActions();
  }

  @Get('source/:slug')
  async getExternalActionWithSlug(@Param() slugDto: { slug: string }) {
    return await this.actionService.getExternalActionWithSlug(slugDto.slug);
  }

  @Get()
  async getActions(@Query() workspaceIdDto: WorkspaceRequestParamsDto) {
    return await this.actionService.getActions(workspaceIdDto.workspaceId);
  }

  @Get(':slug')
  async getActionConfig(@Param() slugDto: { slug: string }) {
    return await this.actionService.getActionConfig(slugDto.slug);
  }

  @Post(':slug/inputs')
  async updateActionInputs(
    @Body() updateBodyDto: UpdateActionInputsDto,
    @Param() actionSlugDto: ActionSlugDto,
  ) {
    return await this.actionService.updateActionInputs(
      updateBodyDto,
      actionSlugDto.slug,
    );
  }
}
