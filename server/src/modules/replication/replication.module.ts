/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import ReplicationService from './replication.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ReplicationService, ConfigService],
  exports: [],
})
export class ReplicationModule {}
