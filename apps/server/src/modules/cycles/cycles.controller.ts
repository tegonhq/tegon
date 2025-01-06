import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { UpdateCycleDateDto } from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';
import { AdminGuard } from 'modules/users/admin.guard';

import { CyclesService } from './cycles.service';

@Controller({
  version: '1',
  path: 'cycles',
})
export class CyclesController {
  constructor(private cycles: CyclesService) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  async createCycle(@Body('teamId') teamId: string) {
    return await this.cycles.createCycles(teamId);
  }

  @Post(':cycleId')
  @UseGuards(AuthGuard, AdminGuard)
  async updateCycleDate(
    @Param('cycleId') cycleId: string,
    @Body() cycleData: UpdateCycleDateDto,
  ) {
    return await this.cycles.updateCycleDates(cycleId, cycleData);
  }
}
