import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateActionDto } from '@tegonhq/types';
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

  @Get()
  async getActions() {
    return await this.actionService.getActions();
  }

  @Get(':slug')
  async getActionConfig(@Param() slugDto: { slug: string }) {
    return await this.actionService.getActionConfig(slugDto.slug);
  }
}
