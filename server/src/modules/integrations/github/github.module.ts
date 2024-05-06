/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import IssuesHistoryService from 'modules/issue-history/issue-history.service';
import IssueRelationService from 'modules/issue-relation/issue-relation.service';
import { IssuesModule } from 'modules/issues/issues.module';
import IssuesService from 'modules/issues/issues.service';
import { LinkedIssueModule } from 'modules/linked-issue/linked-issue.module';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { VectorModule } from 'modules/vector/vector.module';

import { GithubController } from './github.controller';
import { GithubProcessor } from './github.processor';
import { GithubQueue } from './github.queue';
import GithubService from './github.service';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    IssuesModule,
    LinkedIssueModule,
    NotificationsModule,
    VectorModule,
    BullModule.registerQueue({ name: 'github' }),
  ],
  controllers: [GithubController],
  providers: [
    PrismaService,
    GithubService,
    IssuesService,
    IssuesHistoryService,
    GithubQueue,
    GithubProcessor,
    IssueRelationService,
  ],
  exports: [GithubService, GithubQueue],
})
export class GithubModule {}
