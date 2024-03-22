/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import config from 'common/configs/config';
import { loggingMiddleware } from 'common/middleware/logging.middleware';

import { AuthModule } from 'modules/auth/auth.module';
import { BullConfigModule } from 'modules/bull/bull.module';
import { IntegrationAccountModule } from 'modules/integration-account/integration-account.module';
import { IntegrationDefinitionModule } from 'modules/integration-definition/integration-definition.module';
import { IssueCommentsModule } from 'modules/issue-comments/issue-comments.module';
import { IssueHistoryModule } from 'modules/issue-history/issue-history.module';
import { IssueRelationModule } from 'modules/issue-relation/issue-relation.module';
import { IssuesModule } from 'modules/issues/issues.module';
import { LabelsModule } from 'modules/labels/labels.module';
import { LinkedIssueModule } from 'modules/linked-issue/linked-issue.module';
import { OAuthCallbackModule } from 'modules/oauth-callback/oauth-callback.module';
import { ReplicationModule } from 'modules/replication/replication.module';
import { SyncModule } from 'modules/sync/sync.module';
import { SyncActionsModule } from 'modules/sync-actions/sync-actions.module';
import { TeamsModule } from 'modules/teams/teams.module';
import { TemplatesModule } from 'modules/templates/templates.module';
import { UsersModule } from 'modules/users/users.module';
import { WebhooksModule } from 'modules/webhooks/webhooks.module';
import { WorkflowsModule } from 'modules/workflows/workflows.module';
import { WorkspacesModule } from 'modules/workspaces/workspaces.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(new Logger('PrismaMiddleware'))], // configure your prisma middleware
      },
    }),

    AuthModule.forRoot(),
    UsersModule,
    WorkspacesModule,
    TeamsModule,
    LabelsModule,
    TemplatesModule,
    WorkflowsModule,
    IssuesModule,
    IssueCommentsModule,
    IssueHistoryModule,
    LinkedIssueModule,
    IssueRelationModule,

    ReplicationModule,
    SyncActionsModule,
    SyncModule,
    WebhooksModule,

    IntegrationDefinitionModule,
    OAuthCallbackModule,
    IntegrationAccountModule,

    BullConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // { provide: APP_INTERCEPTOR, useClass: SyncActionsInterceptor },
  ],
})
export class AppModule {}
