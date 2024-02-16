/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { Team, UsersOnTeams } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  UpdateTeamInput,
  TeamRequestParams,
  WorkspaceRequestParams,
  PreferenceInput,
  CreateTeamInput,
  TeamMemberInput,
} from './teams.interface';

@Injectable()
export default class TeamsService {
  constructor(private prisma: PrismaService) {}

  async getAllTeams(
    workspaceParams: WorkspaceRequestParams,
    userId: string,
  ): Promise<Team[]> {
    const teams = await this.prisma.usersOnTeams.findMany({
      where: { userId, team: { workspaceId: workspaceParams.workspaceId } },
      select: { team: true },
    });
    return teams.map((userOnTeam) => userOnTeam.team);
  }

  async getTeam(TeamRequestParams: TeamRequestParams): Promise<Team> {
    return await this.prisma.team.findUnique({
      where: {
        id: TeamRequestParams.teamId,
      },
    });
  }

  async createTeam(
    WorkspaceRequestParams: WorkspaceRequestParams,
    userId: string,
    teamData: CreateTeamInput,
  ): Promise<Team> {
    const team = await this.prisma.team.create({
      data: {
        workspaceId: WorkspaceRequestParams.workspaceId,
        ...teamData,
      },
    });

    await this.addTeamMember(team.id, userId);
    return team;
  }

  async updateTeam(
    teamRequestParams: TeamRequestParams,
    teamData: UpdateTeamInput,
  ): Promise<Team> {
    return await this.prisma.team.update({
      data: {
        ...teamData,
      },
      where: {
        id: teamRequestParams.teamId,
      },
    });
  }

  async deleteTeam(teamRequestParams: TeamRequestParams): Promise<Team> {
    return await this.prisma.team.update({
      where: {
        id: teamRequestParams.teamId,
      },
      data: {
        deleted: new Date().toISOString(),
      },
    });
  }

  async createUpdatePreference(
    teamRequestParams: TeamRequestParams,
    preferenceData: PreferenceInput,
  ) {
    return await this.prisma.teamPreference.upsert({
      where: {
        teamId_preference: {
          teamId: teamRequestParams.teamId,
          preference: preferenceData.preference,
        },
      },
      update: {
        value: preferenceData.value.toString(),
      },
      create: {
        teamId: teamRequestParams.teamId,
        preference: preferenceData.preference,
        value: preferenceData.value.toString(),
      },
    });
  }

  async addTeamMember(teamId: string, userId: string): Promise<UsersOnTeams> {
    return await this.prisma.usersOnTeams.create({
      data: { teamId: teamId, userId: userId },
      include: { user: true },
    });
  }

  async getTeamMembers(teamRequestParams: TeamRequestParams): Promise<UsersOnTeams[]> { 
    return await this.prisma.usersOnTeams.findMany({
      where: { teamId: teamRequestParams.teamId },
      include: { user: true },
    });
  }
  

  async removeTeamMember(
    teamRequestParams: TeamRequestParams,
    teamMemberData: TeamMemberInput,
  ): Promise<UsersOnTeams> {
    return await this.prisma.usersOnTeams.delete({
      where: {
        userId_teamId: {
          userId: teamMemberData.userId,
          teamId: teamRequestParams.teamId,
        },
      },
    });
  }
}
