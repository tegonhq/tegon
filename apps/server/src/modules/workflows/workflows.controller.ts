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
import { Workflow } from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';

import {
  UpdateWorkflowInput,
  WorkflowRequestIdBody,
  TeamRequestIdBody,
} from './workflows.interface';
import WorkflowsService from './workflows.service';

@Controller({
  version: '1',
  path: ':teamId/workflows',
})
@ApiTags('Workflows')
export class WorkflowsController {
  constructor(private workflowsService: WorkflowsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllWorkflows(
    @Param() teamId: TeamRequestIdBody,
  ): Promise<Workflow[]> {
    return await this.workflowsService.getAllWorkflows(teamId);
  }

  @Get(':workflowId')
  @UseGuards(AuthGuard)
  async getWorkflow(
    @Param()
    workflowId: WorkflowRequestIdBody,
  ): Promise<Workflow> {
    return await this.workflowsService.getWorkflow(workflowId);
  }

  @Post(':workflowId')
  @UseGuards(AuthGuard)
  async updateWorkflow(
    @Param()
    workflowId: WorkflowRequestIdBody,
    @Body() workflowData: UpdateWorkflowInput,
  ): Promise<Workflow> {
    return await this.workflowsService.updateWorkflow(workflowId, workflowData);
  }

  @Delete(':workflowId')
  @UseGuards(AuthGuard)
  async deleteWorkflow(
    @Param()
    workflowId: WorkflowRequestIdBody,
  ): Promise<Workflow> {
    return await this.workflowsService.deleteWorkflow(workflowId);
  }
}
