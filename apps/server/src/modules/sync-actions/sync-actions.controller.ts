import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'modules/auth/auth.guard';

import {
  BootstrapRequestQuery,
  DeltaRequestQuery,
} from './sync-actions.interface';
import SyncActionsService from './sync-actions.service';

@Controller({
  version: '1',
  path: 'sync_actions',
})
@ApiTags('Sync Actions')
export class SyncActionsController {
  constructor(private syncActionsService: SyncActionsService) {}

  @Get('bootstrap')
  @UseGuards(AuthGuard)
  async getBootstrap(@Query() BootstrapQuery: BootstrapRequestQuery) {
    return await this.syncActionsService.getBootstrap(
      BootstrapQuery.modelNames,
      BootstrapQuery.workspaceId,
      BootstrapQuery.userId,
    );
  }

  @Get('delta')
  @UseGuards(AuthGuard)
  async getDelta(@Query() deltaQuery: DeltaRequestQuery) {
    return await this.syncActionsService.getDelta(
      deltaQuery.modelNames,
      BigInt(deltaQuery.lastSequenceId),
      deltaQuery.workspaceId,
      deltaQuery.userId,
    );
  }
}
