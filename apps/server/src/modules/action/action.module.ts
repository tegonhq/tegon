import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';
import { UsersService } from 'modules/users/users.service';
import WorkspacesService from 'modules/workspaces/workspaces.service';

import { ActionController } from './action.controller';
import ActionService from './action.service';

@Module({
  imports: [PrismaModule],
  controllers: [ActionController],
  providers: [
    PrismaService,
    ActionService,
    UsersService,
    TriggerdevService,
    WorkspacesService,
  ],
  exports: [ActionService],
})
export class ActionModule {}
