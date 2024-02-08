/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import SyncActionsService from './syncActions.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [],
  //TODO: Add respective models used in the service. For now using prismaService
  providers: [SyncActionsService, PrismaService], 
  exports: [SyncActionsService],
})
export class SyncActionsModule {}
