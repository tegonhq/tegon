import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateWorkflowDTO,
  UpdateWorkflowDTO,
  Workflow,
  WorkflowRequestParamsDto,
} from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';

import WorkflowsService from './workflows.service';

@Controller({
  version: '1',
  path: ':teamId/workflows',
})
export class WorkflowsController {
  constructor(private workflowsService: WorkflowsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllWorkflows(
    @Param() workflowRequestParams: WorkflowRequestParamsDto,
  ): Promise<Workflow[]> {
    return await this.workflowsService.getAllWorkflows(workflowRequestParams);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createWorkflow(
    @Param() workflowRequestParams: WorkflowRequestParamsDto,
    @Body() workflowData: CreateWorkflowDTO,
  ): Promise<Workflow> {
    return await this.workflowsService.createWorkflow(
      workflowRequestParams,
      workflowData,
    );
  }

  @Get(':workflowId')
  @UseGuards(AuthGuard)
  async getWorkflow(
    @Param()
    workflowRequestParams: WorkflowRequestParamsDto,
  ): Promise<Workflow> {
    return await this.workflowsService.getWorkflow(workflowRequestParams);
  }

  @Post(':workflowId')
  @UseGuards(AuthGuard)
  async updateWorkflow(
    @Param()
    workflowRequestParams: WorkflowRequestParamsDto,
    @Body() workflowData: UpdateWorkflowDTO,
  ): Promise<Workflow> {
    return await this.workflowsService.updateWorkflow(
      workflowRequestParams,
      workflowData,
    );
  }

  @Delete(':workflowId')
  @UseGuards(AuthGuard)
  async deleteWorkflow(
    @Param()
    workflowRequestParams: WorkflowRequestParamsDto,
  ): Promise<Workflow> {
    return await this.workflowsService.deleteWorkflow(workflowRequestParams);
  }
}
