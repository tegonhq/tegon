import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

import { ActionCreateResource, ActionDeployDto } from './action.interface';
import ActionService from './action.service';

@Controller({
  version: '1',
  path: 'action',
})
export class ActionController {
  constructor(private actionService: ActionService) {}

  @Post('deploy')
  @UseGuards(AuthGuard)
  async deploy(
    @SessionDecorator() session: SessionContainer,
    @Body() actionDeploy: ActionDeployDto,
  ) {
    const userId = session.getUserId();

    return await this.actionService.deploy(userId, actionDeploy);
  }

  @Post('create-resource')
  @UseGuards(AuthGuard)
  async createResource(
    @SessionDecorator() session: SessionContainer,
    @Body() actionCreateResource: ActionCreateResource,
  ) {
    const userId = session.getUserId();

    return await this.actionService.createResource(
      actionCreateResource,
      userId,
    );
  }
}
