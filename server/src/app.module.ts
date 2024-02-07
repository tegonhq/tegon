/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SyncActionsInterceptor } from 'interceptors/syncActions.interceptor';
import { PrismaModule } from 'nestjs-prisma';

import config from 'common/configs/config';
import { loggingMiddleware } from 'common/middleware/logging.middleware';

import { AuthModule } from 'modules/auth/auth.module';
import { LabelsModule } from 'modules/labels/labels.module';
import { ReplicationModule } from 'modules/replication/replication.module';
import { SyncModule } from 'modules/sync/sync.module';
import { SyncActionsModule } from 'modules/syncActions/syncActions.moduels';
import { TeamsModule } from 'modules/teams/teams.module';
import { TemplatesModule } from 'modules/templates/templates.module';
import { UsersModule } from 'modules/users/users.module';
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

    ReplicationModule,
    SyncActionsModule,
    SyncModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: SyncActionsInterceptor },
  ],
})
export class AppModule {}
