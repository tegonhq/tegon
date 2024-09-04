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

  @Post('create-resource')
  @UseGuards(ActionGuard)
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
    @Param() slugDto: { slug: string },
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

  @Post(':slug/run')
  @UseGuards(ActionGuard)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async run(@Param() slugDto: { slug: string }, @Body() runBody: any) {
    return await this.actionService.run(
      runBody.workpspaceId,
      slugDto.slug,
      runBody.payload,
    );
  }

  @Get()
  @UseGuards(ActionGuard)
  async getActions(@Query() workspaceIdDto: WorkspaceRequestParamsDto) {
    return await this.actionService.getActions(workspaceIdDto.workspaceId);
  }

  @Get(':slug')
  async getActionConfig(@Param() slugDto: { slug: string }) {
    return await getActionConfig(slugDto.slug);
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
