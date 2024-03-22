/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IssuesModule } from 'modules/issues/issues.module';
import IssuesService from 'modules/issues/issues.service';

import GithubService from './github.service';
import { LinkedIssueModule } from 'modules/linked-issue/linked-issue.module';
import IssuesHistoryService from 'modules/issue-history/issue-history.service';
import { BullModule } from '@nestjs/bull';
import { GithubQueue } from './github.queue';
import { GithubProcessor } from './github.processor';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    IssuesModule,
    LinkedIssueModule,
    BullModule.registerQueue({ name: 'github' }),
  ],
  controllers: [],
  providers: [
    PrismaService,
    GithubService,
    IssuesService,
    IssuesHistoryService,
    GithubQueue,
    GithubProcessor,
  ],
  exports: [GithubService, GithubQueue],
})
export class GithubModule {}
