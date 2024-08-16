import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';

import ActionEventService from './action-event.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [],
  // TODO: Add respective models used in the service. For now using prismaService
  providers: [ActionEventService, PrismaService, TriggerdevService],
  exports: [ActionEventService],
})
export class ActionEventModule {}
