/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { Workflow } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  CreateWorkflowInput,
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

  async createWorkflow(workflowData: CreateWorkflowInput): Promise<Workflow> {
    const label = await this.prisma.workflow.create({
      data: {
        ...workflowData,
      },
    });

    return label;
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
    return await this.prisma.workflow.delete({
      where: {
        id: workflowRequestIdBody.workflowId,
      },
    });
  }
}
