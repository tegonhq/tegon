/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import config from 'common/configs/config';
import { loggingMiddleware } from 'common/middleware/logging.middleware';

import { AuthModule } from 'modules/auth/auth.module';
import { UsersModule } from 'modules/users/users.module';
import { WorkspacesModule } from 'modules/workspaces/workspaces.module';
import { LabelsModule } from 'modules/labels/labels.module';
import { TemplatesModule } from 'modules/templates/templates.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamsModule } from 'modules/teams/teams.module';
import { WorkflowsModule } from 'modules/workflows/workflows.module';

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
    WorkflowsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
