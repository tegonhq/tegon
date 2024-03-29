/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IssueHistory } from '@@generated/issueHistory/entities';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IssueHistoryModule } from 'modules/issue-history/issue-history.module';
import IssueRelationService from 'modules/issue-relation/issue-relation.service';
import { LinkedIssueModule } from 'modules/linked-issue/linked-issue.module';

import { IssuesController } from './issues.controller';
import { IssuesProcessor } from './issues.processor';
import { IssuesQueue } from './issues.queue';
import IssuesService from './issues.service';
import { VectorModule } from 'modules/vector/vector.module';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    IssueHistoryModule,
    LinkedIssueModule,
    VectorModule,
    BullModule.registerQueue({ name: 'issues' }),
  ],
  controllers: [IssuesController],
  providers: [
    IssuesService,
    PrismaService,
    IssueHistory,
    IssuesQueue,
    IssuesProcessor,
    IssueRelationService,
  ],
  exports: [IssuesService, IssuesQueue],
})
export class IssuesModule {}
