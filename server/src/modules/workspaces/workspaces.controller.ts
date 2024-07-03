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
import { UsersOnWorkspaces, Workspace } from '@prisma/client';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

import {
  CreateWorkspaceInput,
  InviteActionBody,
  InviteUsersBody,
  UpdateWorkspaceInput,
  UserBody,
  WorkspaceIdRequestBody,
} from './workspaces.interface';
import WorkspacesService from './workspaces.service';

@Controller({
  version: '1',
  path: 'workspaces',
})
@ApiTags('Workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Post()
  @UseGuards(new AuthGuard())
  async createWorkspace(
    @SessionDecorator() session: SessionContainer,
    @Body() workspaceData: CreateWorkspaceInput,
  ): Promise<Workspace> {
    const userId = session.getUserId();
    return await this.workspacesService.createWorkspace(userId, workspaceData);
  }

  @Get()
  @UseGuards(new AuthGuard())
  async getAllWorkspaces(
    @SessionDecorator() session: SessionContainer,
  ): Promise<Workspace[]> {
    const userId = session.getUserId();
    return await this.workspacesService.getAllWorkspaces(userId);
  }

  @Get('name/:workspaceName')
  @UseGuards(new AuthGuard())
  async getWorkspaceByName(
    @Param('workspaceName') workspaceName: string,
  ): Promise<Workspace> {
    return await this.workspacesService.getWorkspaceByName(workspaceName);
  }

  @Post('seed_workspaces')
  async seedWorkspaces() {
    await this.workspacesService.seedWorkspaces();
    return { status: 200 };
  }

  @Post('invite_action')
  @UseGuards(new AuthGuard())
  async inviteAction(
    @SessionDecorator() session: SessionContainer,
    @Body() inviteActionBody: InviteActionBody,
  ) {
    const userId = session.getUserId();

    return await this.workspacesService.inviteAction(
      inviteActionBody.inviteId,
      userId,
      inviteActionBody.accept,
    );
  }

  @Get(':workspaceId')
  @UseGuards(new AuthGuard())
  async getWorkspace(
    @Param()
    workspaceId: WorkspaceIdRequestBody,
  ): Promise<Workspace> {
    return await this.workspacesService.getWorkspace(workspaceId);
  }

  @Post(':workspaceId')
  @UseGuards(new AuthGuard())
  async updateWorkspace(
    @Param()
    workspaceId: WorkspaceIdRequestBody,
    @Body() workspaceData: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    return await this.workspacesService.updateWorkspace(
      workspaceId,
      workspaceData,
    );
  }

  @Delete(':workspaceId')
  @UseGuards(new AuthGuard())
  async deleteWorkspace(
    @Param()
    workspaceId: WorkspaceIdRequestBody,
  ): Promise<Workspace> {
    return await this.workspacesService.deleteWorkspace(workspaceId);
  }

  @Post(':workspaceId/add_users')
  @UseGuards(new AuthGuard())
  async addUserToWorkspace(
    @Param() WorkspaceIdRequestBody: WorkspaceIdRequestBody,
    @Body() UserBody: UserBody,
  ): Promise<UsersOnWorkspaces> {
    return await this.workspacesService.addUserToWorkspace(
      WorkspaceIdRequestBody.workspaceId,
      UserBody.userId,
    );
  }

  @Get(':workspaceId/invites')
  @UseGuards(new AuthGuard())
  async invitedUsers(@Param() WorkspaceIdRequestBody: WorkspaceIdRequestBody) {
    return await this.workspacesService.getInvites(
      WorkspaceIdRequestBody.workspaceId,
    );
  }

  @Post(':workspaceId/invite_users')
  @UseGuards(new AuthGuard())
  async inviteUsers(
    @SessionDecorator() session: SessionContainer,
    @Param() workspaceIdRequestBody: WorkspaceIdRequestBody,
    @Body() inviteUsersBody: InviteUsersBody,
  ) {
    return await this.workspacesService.inviteUsers(
      session,
      workspaceIdRequestBody.workspaceId,
      inviteUsersBody,
    );
  }
}
