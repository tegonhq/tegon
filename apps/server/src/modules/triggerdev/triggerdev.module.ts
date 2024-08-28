import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';
import WorkspacesService from 'modules/workspaces/workspaces.service';

import { TriggerdevController } from './triggerdev.controller';
import { TriggerdevService } from './triggerdev.service';

@Module({
  imports: [PrismaModule],
  controllers: [TriggerdevController],
  providers: [
    TriggerdevService,
    UsersService,
    PrismaService,
    WorkspacesService,
  ],
  exports: [TriggerdevService],
})
export class TriggerdevModule {}
