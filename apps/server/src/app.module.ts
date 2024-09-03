import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { PrismaModule } from 'nestjs-prisma';

import config from 'common/configs/config';
import { loggingMiddleware } from 'common/middleware/logging.middleware';

import { ActionModule } from 'modules/action/action.module';
import { AIRequestsModule } from 'modules/ai-requests/ai-requests.module';
import { ALSModule } from 'modules/als/als.module';
import { AttachmentModule } from 'modules/attachments/attachments.module';
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
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { OAuthCallbackModule } from 'modules/oauth-callback/oauth-callback.module';
import { ReplicationModule } from 'modules/replication/replication.module';
import { SearchModule } from 'modules/search/search.module';
import { SyncModule } from 'modules/sync/sync.module';
import { SyncActionsModule } from 'modules/sync-actions/sync-actions.module';
import { TeamsModule } from 'modules/teams/teams.module';
import { TemplatesModule } from 'modules/templates/templates.module';
import { TriggerdevModule } from 'modules/triggerdev/triggerdev.module';
import { UsersModule } from 'modules/users/users.module';
import { ViewsModule } from 'modules/views/views.module';
import { WebhookModule } from 'modules/webhook/webhook.module';
import { WorkflowsModule } from 'modules/workflows/workflows.module';
import { WorkspacesModule } from 'modules/workspaces/workspaces.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(new Logger('PrismaMiddleware'))], // configure your prisma middleware
      },
    }),

    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: `${process.env.SMTP_DEFAULT_FROM}`,
      },
      template: {
        dir: `${process.cwd()}/templates`,
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),

    AuthModule.forRoot(),
    ALSModule,
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
    NotificationsModule,
    SearchModule,
    AttachmentModule,
    ViewsModule,
    TriggerdevModule,
    ActionModule,
    AIRequestsModule,

    WebhookModule,

    ReplicationModule,
    SyncActionsModule,
    SyncModule,

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
