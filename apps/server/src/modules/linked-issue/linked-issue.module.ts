import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';

import { LinkedIssueController } from './linked-issue.controller';
import LinkedIssueService from './linked-issue.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [LinkedIssueController],
  providers: [PrismaService, LinkedIssueService, UsersService],
  exports: [LinkedIssueService],
})
export class LinkedIssueModule {}
