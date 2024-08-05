import { IssueHistory } from '@tegonhq/types';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import AIRequestsService from 'modules/ai-requests/ai-requests.services';
import { IssueHistoryModule } from 'modules/issue-history/issue-history.module';
import IssueRelationService from 'modules/issue-relation/issue-relation.service';
import { LinkedIssueModule } from 'modules/linked-issue/linked-issue.module';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { VectorModule } from 'modules/vector/vector.module';

import { IssuesAIController } from './issues-ai.controller';
import IssuesAIService from './issues-ai.service';
import { IssuesController } from './issues.controller';
import { IssuesProcessor } from './issues.processor';
import { IssuesQueue } from './issues.queue';
import IssuesService from './issues.service';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    IssueHistoryModule,
    LinkedIssueModule,
    NotificationsModule,
    VectorModule,
    BullModule.registerQueue({ name: 'issues' }),
  ],
  controllers: [IssuesController, IssuesAIController],
  providers: [
    IssuesService,
    PrismaService,
    IssueHistory,
    IssuesQueue,
    IssuesProcessor,
    IssueRelationService,
    AIRequestsService,
    IssuesAIService,
  ],
  exports: [IssuesService, IssuesQueue],
})
export class IssuesModule {}
