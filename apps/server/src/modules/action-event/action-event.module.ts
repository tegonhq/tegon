import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IntegrationsModule } from 'modules/integrations/integrations.module';

import ActionEventService from './action-event.service';

@Module({
  imports: [PrismaModule, HttpModule, IntegrationsModule],
  controllers: [],
  // TODO: Add respective models used in the service. For now using prismaService
  providers: [ActionEventService, PrismaService],
  exports: [ActionEventService],
})
export class ActionEventModule {}
