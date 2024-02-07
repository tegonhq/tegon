/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

import { WorkflowsController } from './workflows.controller';
import WorkflowsService from './workflows.service';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, PrismaService],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}
