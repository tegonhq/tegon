import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  UsersOnWorkspaces,
  Workspace,
  WorkspaceRequestParamsDto,
  UpdateWorkspacePreferencesDto,
} from '@tegonhq/types';
import { Request, Response } from 'express';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';
import { Workspace as WorkspaceD } from 'modules/auth/session.decorator';
import { AdminGuard } from 'modules/users/admin.guard';

import {
  CreateInitialResourcesDto,
  InviteActionBody,
  InviteUsersBody,
  UpdateWorkspaceInput,
  UserBody,
} from './workspaces.interface';
import WorkspacesService from './workspaces.service';

@Controller({
  version: '1',
  path: 'workspaces',
})
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Post('onboarding')
  @UseGuards(AuthGuard)
  async createIntialResources(
    @SessionDecorator() session: SessionContainer,
    @Body() workspaceData: CreateInitialResourcesDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const userId = session.getUserId();
    await this.workspacesService.createInitialResources(
      userId,
      workspaceData,
      res,
      req,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllWorkspaces(
    @SessionDecorator() session: SessionContainer,
  ): Promise<Workspace[]> {
    const userId = session.getUserId();
    return await this.workspacesService.getAllWorkspaces(userId);
  }

  @Get('name/:workspaceName')
  @UseGuards(AuthGuard)
  async getWorkspaceByName(
    @Param('workspaceName') workspaceName: string,
  ): Promise<Workspace> {
    return await this.workspacesService.getWorkspaceByName(workspaceName);
  }

  @Get('slug/:workspaceSlug')
  @UseGuards(AuthGuard)
  async getWorkspaceBySlug(
    @Param('workspaceSlug') workspaceSlug: string,
  ): Promise<Workspace> {
    return await this.workspacesService.getWorkspaceBySlug(workspaceSlug);
  }

  @Post('invite_action')
  @UseGuards(AuthGuard)
  async inviteAction(
    @SessionDecorator() session: SessionContainer,
    @Body() inviteActionBody: InviteActionBody,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const userId = session.getUserId();

    return await this.workspacesService.inviteAction(
      request,
      response,
      inviteActionBody.inviteId,
      userId,
      inviteActionBody.accept,
    );
  }

  @Get(':workspaceId')
  @UseGuards(AuthGuard)
  async getWorkspace(
    @Param()
    workspaceId: WorkspaceRequestParamsDto,
  ): Promise<Workspace> {
    return await this.workspacesService.getWorkspace(workspaceId);
  }

  @Post('preferences')
  @UseGuards(AuthGuard)
  async updateWorkspacePreferences(
    @WorkspaceD() workspaceId: string,
    @Body() workspaceData: UpdateWorkspacePreferencesDto,
  ): Promise<Workspace> {
    return await this.workspacesService.updateWorkspacePreferences(
      workspaceId,
      workspaceData,
    );
  }

  @Post(':workspaceId')
  @UseGuards(AuthGuard)
  async updateWorkspace(
    @Param()
    workspaceId: WorkspaceRequestParamsDto,
    @Body() workspaceData: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    return await this.workspacesService.updateWorkspace(
      workspaceId,
      workspaceData,
    );
  }

  @Delete(':workspaceId')
  @UseGuards(AuthGuard)
  async deleteWorkspace(
    @Param()
    workspaceId: WorkspaceRequestParamsDto,
  ): Promise<Workspace> {
    return await this.workspacesService.deleteWorkspace(workspaceId);
  }

  @Post(':workspaceId/add_users')
  @UseGuards(AuthGuard)
  async addUserToWorkspace(
    @Param() WorkspaceRequestParamsDto: WorkspaceRequestParamsDto,
    @Body() UserBody: UserBody,
  ): Promise<UsersOnWorkspaces> {
    return await this.workspacesService.addUserToWorkspace(
      WorkspaceRequestParamsDto.workspaceId,
      UserBody.userId,
    );
  }

  @Get(':workspaceId/invites')
  @UseGuards(AuthGuard)
  async invitedUsers(
    @Param() WorkspaceRequestParamsDto: WorkspaceRequestParamsDto,
  ) {
    return await this.workspacesService.getInvites(
      WorkspaceRequestParamsDto.workspaceId,
    );
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post(':workspaceId/invite_users')
  async inviteUsers(
    @SessionDecorator() session: SessionContainer,
    @Param() workspaceIdRequestBody: WorkspaceRequestParamsDto,
    @Body() inviteUsersBody: InviteUsersBody,
  ) {
    return await this.workspacesService.inviteUsers(
      session,
      workspaceIdRequestBody.workspaceId,
      inviteUsersBody,
    );
  }
}
