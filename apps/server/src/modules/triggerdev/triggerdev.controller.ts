import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WorkspaceRequestParamsDto } from '@tegonhq/types';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { ActionGaurd } from 'modules/action/action.gaurd';
import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

import { TriggerdevService } from './triggerdev.service';

@Controller({
  version: '1',
  path: 'triggerdev',
})
export class TriggerdevController {
  constructor(private triggerdevService: TriggerdevService) {}

  @Get()
  @UseGuards(AuthGuard, ActionGaurd)
  async getRequiredKeys(
    @SessionDecorator() session: SessionContainer,
    @Query() requestParams: WorkspaceRequestParamsDto,
  ) {
    const userId = session.getUserId();
    return this.triggerdevService.getRequiredKeys(
      requestParams.workspaceId,
      userId,
    );
  }
}
