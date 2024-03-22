/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IssueHistory } from '@@generated/issueHistory/entities';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IssueHistoryModule } from 'modules/issue-history/issue-history.module';

import { IssuesController } from './issues.controller';
import IssuesService from './issues.service';
import { BullModule } from '@nestjs/bull';
import { IssuesQueue } from './issues.queue';
import { IssuesProcessor } from './issues.processor';
import { LinkedIssueModule } from 'modules/linked-issue/linked-issue.module';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    IssueHistoryModule,
    LinkedIssueModule,
    BullModule.registerQueue({ name: 'issues' }),
  ],
  controllers: [IssuesController],
  providers: [
    IssuesService,
    PrismaService,
    IssueHistory,
    IssuesQueue,
    IssuesProcessor,
  ],
  exports: [IssuesService, IssuesQueue],
})
export class IssuesModule {}
