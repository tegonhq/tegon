import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Team, TeamPreference, UsersOnWorkspaces } from '@tegonhq/types';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

import {
  UpdateTeamInput,
  TeamRequestParams,
  PreferenceInput,
  WorkspaceRequestParams,
  CreateTeamInput,
  TeamMemberInput,
} from './teams.interface';
import TeamsService from './teams.service';

@Controller({
  version: '1',
  path: 'teams',
})
@ApiTags('Teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get(':teamId')
  @UseGuards(new AuthGuard())
  async getTeam(
    @Param()
    teamId: TeamRequestParams,
  ): Promise<Team> {
    return await this.teamsService.getTeam(teamId);
  }

  @Get('name/:teamName')
  @UseGuards(new AuthGuard())
  async getTeamByName(
    @Param('teamName') teamName: string,
    @Query() workspaceParams: WorkspaceRequestParams,
  ): Promise<Team> {
    return await this.teamsService.getTeamByName(
      workspaceParams.workspaceId,
      teamName,
    );
  }

  @Post()
  @UseGuards(new AuthGuard())
  async createTeam(
    @SessionDecorator() session: SessionContainer,
    @Query() WorkspaceParams: WorkspaceRequestParams,
    @Body() teamData: CreateTeamInput,
  ): Promise<Team> {
    const userId = session.getUserId();
    return await this.teamsService.createTeam(
      WorkspaceParams,
      userId,
      teamData,
    );
  }

  @Post(':teamId')
  @UseGuards(new AuthGuard())
  async updateTeam(
    @Param()
    teamRequestParams: TeamRequestParams,
    @Body() teamData: UpdateTeamInput,
  ): Promise<Team> {
    return await this.teamsService.updateTeam(teamRequestParams, teamData);
  }

  @Delete(':teamId')
  @UseGuards(new AuthGuard())
  async deleteTeam(
    @Param()
    teamRequestParams: TeamRequestParams,
  ): Promise<Team> {
    return await this.teamsService.deleteTeam(teamRequestParams);
  }

  @Post(':teamId/preference')
  @UseGuards(new AuthGuard())
  async createUpdatePreference(
    @Param()
    teamRequestParams: TeamRequestParams,
    @Body() preferenceData: PreferenceInput,
  ): Promise<TeamPreference> {
    return await this.teamsService.createUpdatePreference(
      teamRequestParams,
      preferenceData,
    );
  }

  @Post(':teamId/add_member')
  @UseGuards(new AuthGuard())
  async addTeamMember(
    @Param() teamRequestParams: TeamRequestParams,
    @Query() workspaceRequestParams: WorkspaceRequestParams,
    @Body() teamMemberData: TeamMemberInput,
  ): Promise<UsersOnWorkspaces> {
    return await this.teamsService.addTeamMember(
      teamRequestParams.teamId,
      workspaceRequestParams.workspaceId,
      teamMemberData.userId,
    );
  }

  @Get(':teamId/members')
  @UseGuards(new AuthGuard())
  async getTeamMembers(
    @Param()
    teamRequestParams: TeamRequestParams,
  ): Promise<UsersOnWorkspaces[]> {
    return await this.teamsService.getTeamMembers(teamRequestParams);
  }

  @Delete(':teamId/remove_member')
  @UseGuards(new AuthGuard())
  async removeTeamMemeber(
    @Param()
    teamRequestParams: TeamRequestParams,
    @Query() workspaceRequestParams: WorkspaceRequestParams,
    @Body() teamMemberData: TeamMemberInput,
  ): Promise<UsersOnWorkspaces> {
    return await this.teamsService.removeTeamMember(
      teamRequestParams,
      workspaceRequestParams,
      teamMemberData,
    );
  }
}
