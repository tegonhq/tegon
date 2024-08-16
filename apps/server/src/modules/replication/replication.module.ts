import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';

import { SyncModule } from 'modules/sync/sync.module';
import SyncActionsService from 'modules/sync-actions/sync-actions.service';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';

import ReplicationService from './replication.service';

@Module({
  imports: [SyncModule],
  controllers: [],
  providers: [
    ReplicationService,
    ConfigService,
    SyncActionsService,
    TriggerdevService,
    PrismaService,
  ],
  exports: [],
})
export class ReplicationModule {}
