/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { User, Workspace } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  WorkspaceCreateBody,
  WorkspaceRequestIdBody,
  WorkspaceUpdateBody,
} from './workspaces.interface';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async createWorkspace(
    createWorkspaceBody: WorkspaceCreateBody,
    user: User,
  ): Promise<Workspace> {
    const workspace = await this.prisma.workspace.create({
      data: {
        ...createWorkspaceBody,
        userId: user.userId,
      },
    });

    /**
     * Replace the above
     */
    return workspace;
  }

  async getAllWorkspaces(user: User): Promise<Workspace[]> {
    return this.prisma.workspace.findMany({
      where: {
        userId: user.userId,
      },
    });
  }

  async getWorkspaceWithId(workspaceRequestIdBody: WorkspaceRequestIdBody) {
    return this.prisma.workspace.findUnique({
      where: { workspaceId: workspaceRequestIdBody.workspaceId },
    });
  }

  async updateWorkspace(updateWorkspaceBody: WorkspaceUpdateBody) {
    return await this.prisma.workspace.update({
      data: {
        initialSetupComplete: updateWorkspaceBody.initialSetupComplete,
      },
      where: {
        workspaceId: updateWorkspaceBody.workspaceId,
      },
    });
  }

  async deleteWorkspace(workspaceRequestIdBody: WorkspaceRequestIdBody) {
    return await this.prisma.workspace.update({
      where: { workspaceId: workspaceRequestIdBody.workspaceId },
      data: { deleted: new Date() },
    });
  }
}
