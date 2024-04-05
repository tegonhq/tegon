/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IssuesModule } from 'modules/issues/issues.module';
import { LinkedIssueModule } from 'modules/linked-issue/linked-issue.module';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { VectorModule } from 'modules/vector/vector.module';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    IssuesModule,
    LinkedIssueModule,
    NotificationsModule,
    VectorModule,
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [],
})
export class SlackModule {}
