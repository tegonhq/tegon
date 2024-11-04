import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IssuesModule } from 'modules/issues/issues.module';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';
import { UsersService } from 'modules/users/users.service';

import { IssueCommentsController } from './issue-comments.controller';
import IssueCommentsService from './issue-comments.service';

@Module({
  imports: [PrismaModule, HttpModule, NotificationsModule, IssuesModule],
  controllers: [IssueCommentsController],
  providers: [
    IssueCommentsService,
    PrismaService,
    UsersService,
    TriggerdevService,
  ],
  exports: [IssueCommentsService],
})
export class IssueCommentsModule {}
