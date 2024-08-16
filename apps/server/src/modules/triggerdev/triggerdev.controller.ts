import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkspaceRequestParamsDto } from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';

import { TriggerdevService } from './triggerdev.service';

@Controller({
  version: '1',
  path: 'triggerdev',
})
@ApiTags('Triggerdev')
export class TriggerdevController {
  constructor(private triggerdevService: TriggerdevService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getRequiredKeys(@Query() requestParams: WorkspaceRequestParamsDto) {
    return this.triggerdevService.getRequiredKeys(requestParams.workspaceId);
  }
}
