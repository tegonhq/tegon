/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IssueCommentsController } from './issue-comments.controller';
import { IssueCommentsProcessor } from './issue-comments.processor';
import { IssueCommentsQueue } from './issue-comments.queue';
import IssueCommentsService from './issue-comments.service';
import { NotificationsModule } from 'modules/notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    NotificationsModule,
    BullModule.registerQueue({ name: 'issueComments' }),
  ],
  controllers: [IssueCommentsController],
  providers: [
    IssueCommentsService,
    PrismaService,
    IssueCommentsQueue,
    IssueCommentsProcessor,
  ],
  exports: [IssueCommentsService],
})
export class IssueCommentsModule {}
