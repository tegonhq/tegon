/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import SyncActionsService from './syncActions.service';
import { SyncActionsInterceptor } from '../../interceptors/syncActions.interceptor';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [],
  providers: [SyncActionsService, PrismaService, SyncActionsInterceptor],
  exports: [SyncActionsService],
})
export class SyncActionsModule {}
