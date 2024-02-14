/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IssueHistory } from '@@generated/issueHistory/entities';

import { IssueHistoryModule } from 'modules/issue-history/issue-history.module';

import { IssuesController } from './issues.controller';
import IssuesService from './issues.service';

@Module({
  imports: [PrismaModule, HttpModule, IssueHistoryModule],
  controllers: [IssuesController],
  providers: [IssuesService, PrismaService, IssueHistory],
  exports: [IssuesService],
})
export class IssuesModule {}
