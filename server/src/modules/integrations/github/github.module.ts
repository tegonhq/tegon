/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IssuesModule } from 'modules/issues/issues.module';
import IssuesService from 'modules/issues/issues.service';

import GithubService from './github.service';
import { LinkedIssueModule } from 'modules/linked-issue/linked-issue.module';

@Module({
  imports: [PrismaModule, HttpModule, IssuesModule, LinkedIssueModule],
  controllers: [],
  providers: [PrismaService, GithubService, IssuesService],
  exports: [GithubService],
})
export class GithubModule {}
