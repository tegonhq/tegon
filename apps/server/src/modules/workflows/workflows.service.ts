import { Injectable } from '@nestjs/common';
import { Workflow } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import {
  TeamRequestIdBody,
  UpdateWorkflowInput,
  WorkflowRequestIdBody,
} from './workflows.interface';

@Injectable()
export default class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  async getAllWorkflows(
    teamRequestIdBody: TeamRequestIdBody,
  ): Promise<Workflow[]> {
    return await this.prisma.workflow.findMany({
      where: {
        teamId: teamRequestIdBody.teamId,
      },
    });
  }

  async getWorkflow(
    WorkflowRequestIdBody: WorkflowRequestIdBody,
  ): Promise<Workflow> {
    return await this.prisma.workflow.findUnique({
      where: {
        id: WorkflowRequestIdBody.workflowId,
      },
    });
  }

  async updateWorkflow(
    workflowRequestIdBody: WorkflowRequestIdBody,
    workflowData: UpdateWorkflowInput,
  ): Promise<Workflow> {
    return await this.prisma.workflow.update({
      data: {
        ...workflowData,
      },
      where: {
        id: workflowRequestIdBody.workflowId,
      },
    });
  }

  async deleteWorkflow(
    workflowRequestIdBody: WorkflowRequestIdBody,
  ): Promise<Workflow> {
    return await this.prisma.workflow.update({
      where: {
        id: workflowRequestIdBody.workflowId,
      },
      data: {
        deleted: new Date().toISOString(),
      },
    });
  }
}
