/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Workflow } from '@prisma/client';

import { AuthGuard } from 'modules/auth/auth.guard';

import {
  UpdateWorkflowInput,
  WorkflowRequestIdBody,
  TeamRequestIdBody,
  CreateWorkflowInput,
} from './workflows.interface';
import WorkflowsService from './workflows.service';

@Controller({
  version: '1',
  path: ':teamId/workflows',
})
@ApiTags('Workflows')
export class WorkflowsController {
  constructor(private workflowsService: WorkflowsService) {}

  @Post()
  @UseGuards(new AuthGuard())
  async createWorkflow(
    @Body() workflowData: CreateWorkflowInput,
  ): Promise<Workflow> {
    return await this.workflowsService.createWorkflow(workflowData);
  }

  @Get()
  @UseGuards(new AuthGuard())
  async getAllWorkflows(
    @Param() teamId: TeamRequestIdBody,
  ): Promise<Workflow[]> {
    return await this.workflowsService.getAllWorkflows(teamId);
  }

  @Get(':workflowId')
  @UseGuards(new AuthGuard())
  async getWorkflow(
    @Param()
    workflowId: WorkflowRequestIdBody,
  ): Promise<Workflow> {
    return await this.workflowsService.getWorkflow(workflowId);
  }

  @Post(':workflowId')
  @UseGuards(new AuthGuard())
  async updateWorkflow(
    @Param()
    workflowId: WorkflowRequestIdBody,
    @Body() workflowData: UpdateWorkflowInput,
  ): Promise<Workflow> {
    return await this.workflowsService.updateWorkflow(workflowId, workflowData);
  }

  @Delete(':workflowId')
  @UseGuards(new AuthGuard())
  async deleteWorkflow(
    @Param()
    workflowId: WorkflowRequestIdBody,
  ): Promise<Workflow> {
    return await this.workflowsService.deleteWorkflow(workflowId);
  }
}
