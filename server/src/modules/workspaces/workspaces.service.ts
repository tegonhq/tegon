/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { Workspace } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  WorkspaceIdRequestBody,
} from './workspaces.interface';

@Injectable()
export default class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async createWorkspace(
    userId: string,
    workspaceData: CreateWorkspaceInput,
  ): Promise<Workspace> {
    const workspace = await this.prisma.workspace.create({
      data: {
        ...workspaceData,
        usersOnWorkspaces: {
          create: {
            userId,
          },
        },
      },
      include: {
        usersOnWorkspaces: true,
      },
    });

    return workspace;
  }

  async getAllWorkspaces(userId: string): Promise<Workspace[]> {
    return await this.prisma.workspace.findMany({
      where: {
        usersOnWorkspaces: { every: { userId } },
      },
    });
  }

  async getWorkspace(
    WorkspaceIdRequestBody: WorkspaceIdRequestBody,
  ): Promise<Workspace> {
    return await this.prisma.workspace.findUnique({
      where: {
        id: WorkspaceIdRequestBody.workspaceId,
      },
      include: {
        usersOnWorkspaces: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async updateWorkspace(
    WorkspaceIdRequestBody: WorkspaceIdRequestBody,
    workspaceData: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    return await this.prisma.workspace.update({
      data: workspaceData,
      where: {
        id: WorkspaceIdRequestBody.workspaceId,
      },
    });
  }

  async deleteWorkspace(
    WorkspaceIdRequestBody: WorkspaceIdRequestBody,
  ): Promise<Workspace> {
    return await this.prisma.workspace.delete({
      where: {
        id: WorkspaceIdRequestBody.workspaceId,
      },
    });
  }
}
