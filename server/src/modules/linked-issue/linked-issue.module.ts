/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import LinkedIssueService from './linked-issue.service';
import { LinkedIssueController } from './linked-issue.controller';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [LinkedIssueController],
  providers: [PrismaService, LinkedIssueService],
  exports: [LinkedIssueService],
})
export class LinkedIssueModule {}
