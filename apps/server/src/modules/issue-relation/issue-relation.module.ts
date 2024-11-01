import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { TriggerdevService } from 'modules/triggerdev/triggerdev.service';
import { UsersService } from 'modules/users/users.service';

import { IssueRelationController } from './issue-relation.controller';
import IssueRelationService from './issue-relation.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [IssueRelationController],
  providers: [
    IssueRelationService,
    PrismaService,
    UsersService,
    TriggerdevService,
  ],
  exports: [IssueRelationService],
})
export class IssueRelationModule {}
