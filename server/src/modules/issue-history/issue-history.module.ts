/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IssueHistoryController } from './issue-history.controller';
import IssueHistoryService from './issue-history.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [IssueHistoryController],
  providers: [IssueHistoryService, PrismaService],
  exports: [IssueHistoryService],
})
export class IssueHistoryModule {}
