import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { UsersService } from 'modules/users/users.service';

import { WorkflowsController } from './workflows.controller';
import WorkflowsService from './workflows.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, PrismaService, UsersService],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}
