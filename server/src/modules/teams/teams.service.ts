/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { Team } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  UpdateTeamInput,
  TeamRequestParams,
  WorkspaceRequestParams,
  PreferenceInput,
  CreateTeamInput,
} from './teams.interface';

@Injectable()
export default class TeamsService {
  constructor(private prisma: PrismaService) {}

  async getAllTeams(
    workspaceId: WorkspaceRequestParams,
    userId: string,
  ): Promise<Team[]> {
    return await this.prisma.team.findMany({
      where: {
        userId,
        workspaceId: workspaceId.workspaceId,
      },
      include: {
        user: true,
      },
    });
  }

  async getTeam(TeamRequestParams: TeamRequestParams): Promise<Team> {
    return await this.prisma.team.findUnique({
      where: {
        id: TeamRequestParams.teamId,
      },
      include: {
        user: true,
      },
    });
  }

  async createTeam(
    WorkspaceRequestParams: WorkspaceRequestParams,
    userId: string,
    teamData: CreateTeamInput
  ): Promise<Team> {
    return await this.prisma.team.create({
      data: {
        workspaceId: WorkspaceRequestParams.workspaceId, 
        userId,
        ...teamData
      }
    })
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
        deleted: new Date()
      }
    });
  }

  async createUpdatePreference(
    teamRequestParams: TeamRequestParams,
    preferenceData: PreferenceInput,
  ) {
    return await this.prisma.teamPreference.upsert({
      where:{
        teamId_preference:{
          teamId: teamRequestParams.teamId,
          preference: preferenceData.preference
        }
      },
      update:{
        value: preferenceData.value.toString()
      },
      create: {
        teamId: teamRequestParams.teamId,
        preference: preferenceData.preference,
        value: preferenceData.value.toString()
      }
    })
  }
}
