/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IssueCommentsController } from './issue-comments.controller';
import IssueCommentsService from './issue-comments.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [IssueCommentsController],
  providers: [IssueCommentsService, PrismaService],
  exports: [IssueCommentsService],
})
export class IssueCommentsModule {}
