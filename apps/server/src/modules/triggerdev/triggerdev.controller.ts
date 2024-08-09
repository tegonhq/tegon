import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import supertokens from 'supertokens-node';
import { createNewSession } from 'supertokens-node/recipe/session';

import { ApiKeyGuard } from './triggerdev.guard';
import { TriggerdevService } from './triggerdev.service';

@Controller({
  version: '1',
  path: 'triggerdev',
})
@ApiTags('Triggerdev')
export class TriggerdevController {
  constructor(private triggerdevService: TriggerdevService) {}

  @Post('generate_jwt')
  @UseGuards(new ApiKeyGuard())
  async generateJWT(
    @Body()
    {
      accountId,
      userId: userIdFromParams,
    }: { accountId?: string; userId?: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!userIdFromParams || !accountId) {
      new BadRequestException('AccountId is not provided');
    }

    const userId = userIdFromParams
      ? userIdFromParams
      : await this.triggerdevService.getUserId(accountId);

    const session = await createNewSession(
      req,
      res,
      'public',
      supertokens.convertToRecipeUserId(userId),
    );

    const token = session.getAccessToken();

    return { token, userId };
  }
}
