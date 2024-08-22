import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';

import { ActionController } from './action.controller';
import ActionService from './action.service';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';

@Module({
  imports: [PrismaModule],
  controllers: [ActionController],
  providers: [PrismaService, ActionService, UsersService, TriggerdevService],
  exports: [ActionService],
})
export class ActionModule {}
