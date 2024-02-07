/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Module } from '@nestjs/common';

import { SyncGateway } from './sync.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [SyncGateway],
  exports: [SyncGateway],
})
export class SyncModule {}
