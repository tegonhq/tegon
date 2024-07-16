import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import IssueHistoryService from './issue-history.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [],
  providers: [IssueHistoryService, PrismaService],
  exports: [IssueHistoryService],
})
export class IssueHistoryModule {}
