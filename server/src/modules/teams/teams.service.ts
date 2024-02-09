/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { Team } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import {
  UpdateTeamInput,
  TeamRequestIdBody,
  WorkspaceRequestIdBody,
} from './teams.interface';

@Injectable()
export default class TeamsService {
  constructor(private prisma: PrismaService) {}

  async getAllTeams(
    workspaceId: WorkspaceRequestIdBody,
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

  async getTeam(TeamRequestIdBody: TeamRequestIdBody): Promise<Team> {
    return await this.prisma.team.findUnique({
      where: {
        id: TeamRequestIdBody.teamId,
      },
      include: {
        user: true,
      },
    });
  }

  async updateTeam(
    teamRequestIdBody: TeamRequestIdBody,
    teamData: UpdateTeamInput,
  ): Promise<Team> {
    return await this.prisma.team.update({
      data: {
        ...teamData,
      },
      where: {
        id: teamRequestIdBody.teamId,
      },
    });
  }

  async deleteTeam(teamRequestIdBody: TeamRequestIdBody): Promise<Team> {
    return await this.prisma.team.delete({
      where: {
        id: teamRequestIdBody.teamId,
      },
    });
  }

  async createPreference(
    teamRequestIdBody: TeamRequestIdBody,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _preferenceData: UpdateTeamInput,
  ) {
    return await this.prisma.team.findUnique({
      where: {
        id: teamRequestIdBody.teamId,
      },
    });
  }
}
