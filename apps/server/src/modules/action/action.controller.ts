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
  DeleteActionDto,
  ReplayRunDto,
  UpdateActionInputsDto,
} from '@tegonhq/types';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import {
  Session as SessionDecorator,
  Workspace,
} from 'modules/auth/session.decorator';

import { ActionGuard } from './action.guard';
import ActionService from './action.service';
import {
  getActionConfig,
  getExternalActions,
  getExternalActionWithSlug,
} from './action.utils';

@Controller({
  version: '1',
  path: 'action',
})
@UseGuards(AuthGuard)
export class ActionController {
  constructor(private actionService: ActionService) {}

  @Post('create-action')
  @UseGuards(ActionGuard)
  async createAction(
    @SessionDecorator() session: SessionContainer,
    @Body() actionCreateResource: CreateActionDto,
  ) {
    const userId = session.getUserId();

    return await this.actionService.createAction(actionCreateResource, userId);
  }

  @Post('clean-dev-action')
  @UseGuards(ActionGuard)
  async cleanDevActions(
    @SessionDecorator() session: SessionContainer,
    @Body() deleteActionDto: DeleteActionDto,
  ) {
    const userId = session.getUserId();

    return await this.actionService.cleanDevActions(
      deleteActionDto.config.slug,
      deleteActionDto.workspaceId,
      userId,
    );
  }

  @Get('external')
  async getExternalActions() {
    return await getExternalActions();
  }

  @Get('external/:slug')
  async getExternalActionWithSlug(@Param() slugDto: { slug: string }) {
    return await getExternalActionWithSlug(slugDto.slug);
  }

  @Get(':slug/runs')
  @UseGuards(ActionGuard)
  async getRunsForSlug(
    @Workspace() workspaceId: string,
    @Param() slugDto: ActionSlugDto,
    @Query() runIdParams: { runId: string },
  ) {
    if (runIdParams.runId) {
      return await this.actionService.getRunForSlug(
        workspaceId,
        slugDto.slug,
        runIdParams.runId,
      );
    }

    return await this.actionService.getRunsForSlug(workspaceId, slugDto.slug);
  }

  @Get(':slug/inputs')
  @UseGuards(ActionGuard)
  async getInputsForSlug(
    @Workspace() workspaceId: string,
    @Param() slugDto: { slug: string },
  ) {
    return await this.actionService.getInputsForSlug(slugDto.slug, workspaceId);
  }

  @Get()
  @UseGuards(ActionGuard)
  async getActions(@Workspace() workspaceId: string) {
    return await this.actionService.getActions(workspaceId);
  }

  @Post(':slug/replay')
  @UseGuards(ActionGuard)
  async replayRunForSlug(
    @Workspace() workspaceId: string,
    @Param() slugDto: ActionSlugDto,
    @Body() replayBody: ReplayRunDto,
  ) {
    return await this.actionService.replayRunForSlug(
      workspaceId,
      slugDto.slug,
      replayBody.runId,
    );
  }

  @Post(':slug/cancel')
  @UseGuards(ActionGuard)
  async cancelRunForSlug(
    @Workspace() workspaceId: string,
    @Param() slugDto: ActionSlugDto,
    @Body() replayBody: ReplayRunDto,
  ) {
    return await this.actionService.cancelRunForSlug(
      workspaceId,
      slugDto.slug,
      replayBody.runId,
    );
  }

  @Post(':slug/inputs')
  async updateActionInputs(
    @Workspace() workspaceId: string,
    @Body() updateBodyDto: UpdateActionInputsDto,
    @Param() actionSlugDto: ActionSlugDto,
  ) {
    return await this.actionService.updateActionInputs(
      updateBodyDto,
      actionSlugDto.slug,
      workspaceId,
    );
  }

  @Get(':slug')
  async getActionConfig(@Param() slugDto: { slug: string }) {
    return await getActionConfig(slugDto.slug);
  }
}
