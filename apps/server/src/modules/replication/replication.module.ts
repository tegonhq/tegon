import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';

import ActionEventService from 'modules/action-event/action-event.service';
import { IntegrationsModule } from 'modules/integrations/integrations.module';
import { SyncModule } from 'modules/sync/sync.module';
import SyncActionsService from 'modules/sync-actions/sync-actions.service';

import ReplicationService from './replication.service';

@Module({
  imports: [SyncModule, IntegrationsModule],
  controllers: [],
  providers: [
    ReplicationService,
    ConfigService,
    SyncActionsService,
    PrismaService,
    ActionEventService,
  ],
  exports: [],
})
export class ReplicationModule {}
