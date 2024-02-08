/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'modules/auth/auth.guard';

import {
  BootstrapRequestQuery,
  DeltaRequestQuery,
} from './syncActions.interface';
import SyncActionsService from './syncActions.service';

@Controller({
  version: '1',
  path: 'syncActions',
})
@ApiTags('SyncActions')
export class SyncActionsController {
  constructor(private syncActionsService: SyncActionsService) {}

  @Get('bootstrap')
  @UseGuards(new AuthGuard())
  async getBootstrap(@Query() BootstrapQuery: BootstrapRequestQuery) {
    return await this.syncActionsService.getBootstrap(
      BootstrapQuery.models,
      BootstrapQuery.workspaceId,
    );
  }

  @Get('delta')
  @UseGuards(new AuthGuard())
  async getDelta(@Query() deltaQuery: DeltaRequestQuery) {
    return await this.syncActionsService.getDelta(
      parseInt(deltaQuery.lastSequenceId),
      deltaQuery.workspaceId,
    );
  }
}
