/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { Workspace } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  WorkspaceRequestIdBody,
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
        UsersOnWorkspaces: {
          create: {
            userId,
          },
        },
      },
      include: {
        UsersOnWorkspaces: true,
      },
    });

    return workspace;
  }

  async getAllWorkspaces(userId: string): Promise<Workspace[]> {
    return await this.prisma.workspace.findMany({
      where: {
        UsersOnWorkspaces: { every: { userId } },
      },
    });
  }

  async getWorkspace(
    WorkspaceRequestIdBody: WorkspaceRequestIdBody,
  ): Promise<Workspace> {
    return await this.prisma.workspace.findUnique({
      where: {
        id: WorkspaceRequestIdBody.workspaceId,
      },
      include: {
        UsersOnWorkspaces: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async updateWorkspace(
    WorkspaceRequestIdBody: WorkspaceRequestIdBody,
    workspaceData: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    return await this.prisma.workspace.update({
      data: workspaceData,
      where: {
        id: WorkspaceRequestIdBody.workspaceId,
      },
    });
  }


  async deleteWorkspace(
    WorkspaceRequestIdBody: WorkspaceRequestIdBody,
  ): Promise<Workspace> {
    return await this.prisma.workspace.delete({
      where: {
        id: WorkspaceRequestIdBody.workspaceId,
      },
    });
  }
}
