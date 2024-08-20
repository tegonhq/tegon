import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';

import { TriggerdevController } from './triggerdev.controller';
import { TriggerdevService } from './triggerdev.service';

@Module({
  imports: [PrismaModule],
  controllers: [TriggerdevController],
  providers: [TriggerdevService, UsersService, PrismaService],
  exports: [TriggerdevService],
})
export class TriggerdevModule {}
