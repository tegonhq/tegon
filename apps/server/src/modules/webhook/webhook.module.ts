import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IntegrationsModule } from 'modules/integrations/integrations.module';
import IssueCommentsService from 'modules/issue-comments/issue-comments.service';
import { IssuesModule } from 'modules/issues/issues.module';
import LinkedIssueService from 'modules/linked-issue/linked-issue.service';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';

import { WebhookController } from './webhook.controller';
import WebhookService from './webhook.service';

@Module({
  imports: [PrismaModule, IntegrationsModule, IssuesModule],
  controllers: [WebhookController],
  providers: [
    PrismaService,
    WebhookService,
    TriggerdevService,
    IssueCommentsService,
    LinkedIssueService,
  ],
  exports: [],
})
export class WebhookModule {}
