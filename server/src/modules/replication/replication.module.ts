/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SyncModule } from 'modules/sync/sync.module';

import ReplicationService from './replication.service';
import SyncActionsService from 'modules/syncActions/syncActions.service';

@Module({
  imports: [SyncModule],
  controllers: [],
  providers: [ReplicationService, ConfigService, SyncActionsService],
  exports: [],
})
export class ReplicationModule {}
