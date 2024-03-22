/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { GithubModule } from 'modules/integrations/github/github.module';
import IssuesHistoryService from 'modules/issue-history/issue-history.service';
import { IssuesModule } from 'modules/issues/issues.module';
import { LinkedIssueModule } from 'modules/linked-issue/linked-issue.module';

import { WebhookController } from './webhooks.controller';
import WebhookService from './webhooks.service';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    IssuesModule,
    LinkedIssueModule,
    GithubModule,
  ],
  controllers: [WebhookController],
  providers: [PrismaService, WebhookService, IssuesHistoryService],
  exports: [],
})
export class WebhooksModule {}
