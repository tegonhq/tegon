/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { LinkedIssueController } from './linked-issue.controller';
import LinkedIssueService from './linked-issue.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [LinkedIssueController],
  providers: [PrismaService, LinkedIssueService],
  exports: [LinkedIssueService],
})
export class LinkedIssueModule {}
