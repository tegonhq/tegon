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
  ActionSlugDto,
  CreateActionDto,
  UpdateActionInputsDto,
  ActionScheduleParamsDto,
  ActionScheduleDto,
  ActionIdDto,
} from '@tegonhq/types';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import {
  Session as SessionDecorator,
  UserId,
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
  @UseGuards(AuthGuard)
  async createAction(
    @SessionDecorator() session: SessionContainer,
    @Workspace() workspaceId: string,
    @Body() actionCreateResource: CreateActionDto,
  ) {
    const userId = session.getUserId();

    return await this.actionService.createAction(
      actionCreateResource,
      workspaceId,
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

  @Get(':slug/inputs')
  @UseGuards(ActionGuard)
  async getInputsForSlug(
    @Workspace() workspaceId: string,
    @Param() slugDto: { slug: string },
  ) {
    return await this.actionService.getInputsForSlug(slugDto.slug, workspaceId);
  }

  @Get(':slug')
  async getActionConfig(@Param() slugDto: { slug: string }) {
    return await getActionConfig(slugDto.slug);
  }

  @Get()
  @UseGuards(ActionGuard)
  async getActions(@Workspace() workspaceId: string) {
    return await this.actionService.getActions(workspaceId);
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

  @Post(':slug/schedule')
  async createActionSchedule(
    @Workspace() workspaceId: string,
    @UserId() userId: string,
    @Body() scheduleBodyDto: ActionScheduleDto,
    @Param() actionSlugDto: ActionSlugDto,
  ) {
    return await this.actionService.createActionSchedule(
      actionSlugDto.slug,
      workspaceId,
      scheduleBodyDto,
      userId,
    );
  }

  @Post(':slug/schedule/:scheduleId')
  async updateActionSchedule(
    @Body() scheduleBodyDto: ActionScheduleDto,
    @Param() actionScheduleParams: ActionScheduleParamsDto,
  ) {
    return await this.actionService.udpateActionSchedule(
      actionScheduleParams.actionScheduleId,
      scheduleBodyDto,
    );
  }

  @Post(':actionId/trigger-scheduled')
  @UseGuards(ActionGuard)
  async triggerActionSchedule(@Param() actionIdDto: ActionIdDto) {
    return await this.actionService.triggerActionEntity(actionIdDto.actionId);
  }

  @Delete(':slug/schedule/:scheduleId')
  async deleteActionCron(
    @Param() actionScheduleParams: ActionScheduleParamsDto,
  ) {
    return await this.actionService.deleteActionSchedule(
      actionScheduleParams.actionScheduleId,
    );
  }
}
