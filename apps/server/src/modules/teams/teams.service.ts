import { Injectable } from '@nestjs/common';
import { Team, UsersOnWorkspaces } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import {
  UpdateTeamInput,
  TeamRequestParams,
  WorkspaceRequestParams,
  PreferenceInput,
  CreateTeamInput,
  TeamMemberInput,
  workflowSeedData,
} from './teams.interface';

@Injectable()
export default class TeamsService {
  constructor(private prisma: PrismaService) {}

  async getTeam(TeamRequestParams: TeamRequestParams): Promise<Team> {
    return await this.prisma.team.findUnique({
      where: {
        id: TeamRequestParams.teamId,
      },
    });
  }

  async getTeamByName(workspaceId: string, name: string): Promise<Team | null> {
    return await this.prisma.team.findFirst({
      where: {
        workspaceId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
  }

  async createTeam(
    workspaceRequestParams: WorkspaceRequestParams,
    teamData: CreateTeamInput,
  ): Promise<Team> {
    const team = await this.prisma.team.create({
      data: {
        workspaceId: workspaceRequestParams.workspaceId,
        ...teamData,
        workflow: { create: workflowSeedData },
      },
    });

    const users = await this.prisma.usersOnWorkspaces.findMany({
      where: {
        workspaceId: workspaceRequestParams.workspaceId,
        status: 'ACTIVE',
      },
    });

    await Promise.all(
      users.map(async (user) => {
        await this.addTeamMember(
          team.id,
          workspaceRequestParams.workspaceId,
          user.userId,
        );
      }),
    );

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

  async addTeamMember(
    teamId: string,
    workspaceId: string,
    userId: string,
  ): Promise<UsersOnWorkspaces> {
    const existingTeamIds = await this.prisma.usersOnWorkspaces.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      select: {
        teamIds: true,
      },
    });

    const updatedTeamIds = existingTeamIds?.teamIds.includes(teamId)
      ? existingTeamIds.teamIds
      : [...(existingTeamIds?.teamIds || []), teamId];

    return await this.prisma.usersOnWorkspaces.update({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      data: { teamIds: updatedTeamIds },
      include: { user: true },
    });
  }

  async getTeamMembers(
    teamRequestParams: TeamRequestParams,
  ): Promise<UsersOnWorkspaces[]> {
    return await this.prisma.usersOnWorkspaces.findMany({
      where: { teamIds: { has: teamRequestParams.teamId } },
      include: { user: true },
    });
  }

  async removeTeamMember(
    teamRequestParams: TeamRequestParams,
    workspaceRequestParams: WorkspaceRequestParams,
    teamMemberData: TeamMemberInput,
  ): Promise<UsersOnWorkspaces> {
    const userOnWorkspace = await this.prisma.usersOnWorkspaces.findUnique({
      where: {
        userId_workspaceId: {
          userId: teamMemberData.userId,
          workspaceId: workspaceRequestParams.workspaceId,
        },
      },
    });

    const updatedTeamIds = userOnWorkspace.teamIds.filter(
      (id) => id !== teamRequestParams.teamId,
    );

    return await this.prisma.usersOnWorkspaces.update({
      where: {
        userId_workspaceId: {
          userId: teamMemberData.userId,
          workspaceId: workspaceRequestParams.workspaceId,
        },
      },
      data: { teamIds: updatedTeamIds },
      include: { user: true },
    });
  }
}
