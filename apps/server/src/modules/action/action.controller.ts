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
  WorkspaceRequestParamsDto,
} from '@tegonhq/types';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

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
    @Param() slugDto: ActionSlugDto,
    @Query() runIdParams: { runId: string; workspaceId: string },
  ) {
    if (runIdParams.runId) {
      return await this.actionService.getRunForSlug(
        runIdParams.workspaceId,
        slugDto.slug,
        runIdParams.runId,
      );
    }

    return await this.actionService.getRunsForSlug(
      runIdParams.workspaceId,
      slugDto.slug,
    );
  }

  @Get(':slug/inputs')
  @UseGuards(ActionGuard)
  async getInputsForSlug(
    @Param() slugDto: { slug: string },
    @Query() configParams: { workspaceId: string },
  ) {
    return await this.actionService.getInputsForSlug(
      slugDto.slug,
      configParams.workspaceId,
    );
  }

  @Get()
  @UseGuards(ActionGuard)
  async getActions(@Query() workspaceIdDto: WorkspaceRequestParamsDto) {
    return await this.actionService.getActions(workspaceIdDto.workspaceId);
  }

  @Post(':slug/replay')
  @UseGuards(ActionGuard)
  async replayRunForSlug(
    @Param() slugDto: ActionSlugDto,
    @Body() replayBody: ReplayRunDto,
  ) {
    return await this.actionService.replayRunForSlug(
      replayBody.workspaceId,
      slugDto.slug,
      replayBody.runId,
    );
  }

  @Post(':slug/cancel')
  @UseGuards(ActionGuard)
  async cancelRunForSlug(
    @Param() slugDto: ActionSlugDto,
    @Body() replayBody: ReplayRunDto,
  ) {
    return await this.actionService.cancelRunForSlug(
      replayBody.workspaceId,
      slugDto.slug,
      replayBody.runId,
    );
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

  @Get(':slug')
  async getActionConfig(@Param() slugDto: { slug: string }) {
    return await getActionConfig(slugDto.slug);
  }
}
