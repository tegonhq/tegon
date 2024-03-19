/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

import { BodyInterface, CallbackParams } from './oauth-callback.interface';
import { OAuthCallbackService } from './oauth-callback.service';

@Controller({
  version: '1',
  path: 'oauth',
})
@ApiTags('OAuth Utils')
export class OAuthCallbackController {
  constructor(private oAuthCallbackService: OAuthCallbackService) {}

  @Post()
  @UseGuards(new AuthGuard())
  async getRedirectURL(
    @SessionDecorator() session: SessionContainer,
    @Body() body: BodyInterface,
  ) {
    const userId = session.getUserId();
    return await this.oAuthCallbackService.getRedirectURL(
      body.workspaceId,
      body.integrationDefinitionId,
      body.redirectURL,
      userId,
    );
  }

  @Get('callback')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async callback(@Query() queryParams: CallbackParams, @Res() res: any) {
    return await this.oAuthCallbackService.callbackHandler(queryParams, res);
  }
}
