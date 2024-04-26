/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { AttachmentService } from 'modules/attachments/attachments.service';
import { IssuesModule } from 'modules/issues/issues.module';
import { LinkedIssueModule } from 'modules/linked-issue/linked-issue.module';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { OAuthCallbackModule } from 'modules/oauth-callback/oauth-callback.module';
import { VectorModule } from 'modules/vector/vector.module';

import { SlackController } from './slack.controller';
import SlackService from './slack.service';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    IssuesModule,
    LinkedIssueModule,
    NotificationsModule,
    VectorModule,
    OAuthCallbackModule,
    BullModule.registerQueue({ name: 'slack' }),
  ],
  controllers: [SlackController],
  providers: [PrismaService, SlackService, AttachmentService],
  exports: [SlackService],
})
export class SlackModule {}
