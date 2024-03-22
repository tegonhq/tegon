/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { IssueRelationController } from './issue-relation.controller';
import IssueRelationService from './issue-relation.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [IssueRelationController],
  providers: [IssueRelationService, PrismaService],
  exports: [IssueRelationService],
})
export class IssueRelationModule {}
