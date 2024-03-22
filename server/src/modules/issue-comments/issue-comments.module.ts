/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IssueCommentsController } from './issue-comments.controller';
import IssueCommentsService from './issue-comments.service';
import { BullModule } from '@nestjs/bull';
import { IssueCommentsQueue } from './issue-comments.queue';
import { IssueCommentsProcessor } from './issue-comments.processor';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
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
