/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BodyInterface, CallbackParams } from './oauth_callback.interface';
import { OAuthCallbackService } from './oauth_callback.service';

@Controller({
  version: '1',
  path: 'oauth',
})
@ApiTags('OAuth Utils')
export class OAuthCallbackController {
  constructor(private oAuthCallbackService: OAuthCallbackService) {}

  @Post()
  async getRedirectURL(@Body() body: BodyInterface) {
    return await this.oAuthCallbackService.getRedirectURL(
      body.workspaceId,
      body.integrationDefinitionId,
      body.redirectURL,
    );
  }

  @Get('callback')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async callback(@Query() queryParams: CallbackParams, @Res() res: any) {
    return await this.oAuthCallbackService.callbackHandler(queryParams, res);
  }
}
