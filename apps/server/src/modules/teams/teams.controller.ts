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
  Team,
  UpdateTeamDto,
  UpdateTeamPreferencesDto,
  UsersOnWorkspaces,
} from '@tegonhq/types';

import { AuthGuard } from 'modules/auth/auth.guard';
import { UserId, Workspace } from 'modules/auth/session.decorator';
import { AdminGuard } from 'modules/users/admin.guard';
import { UserIdParams } from 'modules/users/users.interface';

import { TeamRequestParams, CreateTeamInput } from './teams.interface';
import TeamsService from './teams.service';

@Controller({
  version: '1',
  path: 'teams',
})
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getTeams(@Workspace() workspaceId: string): Promise<Team[]> {
    return await this.teamsService.getTeams(workspaceId);
  }

  @Get(':teamId')
  @UseGuards(AuthGuard)
  async getTeam(
    @Param()
    teamId: TeamRequestParams,
  ): Promise<Team> {
    return await this.teamsService.getTeam(teamId);
  }

  @Get('name/:teamName')
  @UseGuards(AuthGuard)
  async getTeamByName(
    @Param('teamName') teamName: string,
    @Workspace() workspaceId: string,
  ): Promise<Team> {
    return await this.teamsService.getTeamByName(workspaceId, teamName);
  }

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  async createTeam(
    @Workspace() workspaceId: string,
    @UserId() userId: string,
    @Body() teamData: CreateTeamInput,
  ): Promise<Team> {
    return await this.teamsService.createTeam(workspaceId, userId, teamData);
  }

  @Post(':teamId/add-member')
  @UseGuards(AuthGuard, AdminGuard)
  async addTeamMember(
    @Param() teamRequestParams: TeamRequestParams,
    @Workspace() workspaceId: string,
    @Body() teamMemberData: UserIdParams,
  ): Promise<UsersOnWorkspaces> {
    return await this.teamsService.addTeamMember(
      teamRequestParams.teamId,
      workspaceId,
      teamMemberData.userId,
    );
  }

  @Post(':teamId/remove-member')
  @UseGuards(AuthGuard, AdminGuard)
  async removeTeamMemeber(
    @Param()
    teamRequestParams: TeamRequestParams,
    @Workspace() workspaceId: string,
    @Body() teamMemberData: UserIdParams,
  ): Promise<UsersOnWorkspaces> {
    return await this.teamsService.removeTeamMember(
      teamRequestParams,
      workspaceId,
      teamMemberData,
    );
  }

  @Post(':teamId/preferences')
  @UseGuards(AuthGuard)
  async updateTeamPreferences(
    @Param()
    teamRequestParams: TeamRequestParams,
    @Body() updateTeamPreferences: UpdateTeamPreferencesDto,
  ): Promise<Team> {
    return await this.teamsService.updateTeamPreferences(
      teamRequestParams,
      updateTeamPreferences,
    );
  }

  @Post(':teamId')
  @UseGuards(AuthGuard)
  async updateTeam(
    @Param()
    teamRequestParams: TeamRequestParams,
    @Body() teamData: UpdateTeamDto,
  ): Promise<Team> {
    return await this.teamsService.updateTeam(teamRequestParams, teamData);
  }

  @Delete(':teamId')
  @UseGuards(AuthGuard)
  async deleteTeam(
    @Param()
    teamRequestParams: TeamRequestParams,
  ): Promise<Team> {
    return await this.teamsService.deleteTeam(teamRequestParams);
  }

  @Get(':teamId/members')
  @UseGuards(AuthGuard)
  async getTeamMembers(
    @Param()
    teamRequestParams: TeamRequestParams,
  ): Promise<UsersOnWorkspaces[]> {
    return await this.teamsService.getTeamMembers(teamRequestParams);
  }
}
