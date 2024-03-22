/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import GithubService from 'modules/integrations/github/github.service';
import IssuesHistoryService from 'modules/issue-history/issue-history.service';

import { WebhookController } from './webhooks.controller';
import WebhookService from './webhooks.service';
import { IssuesModule } from 'modules/issues/issues.module';
import { LinkedIssueModule } from 'modules/linked-issue/linked-issue.module';

@Module({
  imports: [PrismaModule, HttpModule, IssuesModule, LinkedIssueModule],
  controllers: [WebhookController],
  providers: [
    PrismaService,
    WebhookService,
    IssuesHistoryService,
    GithubService,
  ],
  exports: [],
})
export class WebhooksModule {}
