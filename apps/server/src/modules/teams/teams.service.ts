import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateTeamDto,
  RoleEnum,
  Team,
  UpdateTeamDto,
  UpdateTeamPreferencesDto,
  UsersOnWorkspaces,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import { UserIdParams } from 'modules/users/users.interface';

import {
  supportWorkflowSeedData,
  TeamRequestParams,
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
      include: {
        workspace: true,
      },
    });
  }

  async getTeams(workspaceId: string): Promise<Team[]> {
    return await this.prisma.team.findMany({
      where: {
        workspaceId,
        deleted: null,
      },
      include: {
        workspace: true,
      },
    });
  }

  async getTeamByName(
    workspaceId: string,
    nameOrIdentifier: string,
  ): Promise<Team | null> {
    return await this.prisma.team.findFirst({
      where: {
        workspaceId,
        OR: [
          {
            name: {
              equals: nameOrIdentifier,
              mode: 'insensitive',
            },
          },
          {
            identifier: {
              equals: nameOrIdentifier,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        workspace: true,
      },
    });
  }

  async createTeam(
    workspaceId: string,
    userId: string,
    { preferences, ...teamData }: CreateTeamDto,
  ): Promise<Team> {
    const team = await this.prisma.team.create({
      data: {
        workspaceId,
        ...teamData,
        workflow: {
          create:
            preferences.teamType === 'support'
              ? supportWorkflowSeedData
              : workflowSeedData,
        },
        preferences: {
          ...preferences,
        },
      },
    });

    const botAdminUsers = await this.prisma.usersOnWorkspaces.findMany({
      where: {
        workspaceId,
        OR: [{ role: RoleEnum.BOT }, { role: RoleEnum.ADMIN }],
      },
      select: { userId: true },
    });

    const userIds = botAdminUsers.map(({ userId }) => userId);

    userIds.push(userId);

    await Promise.all(
      userIds.map(async (userId: string) => {
        await this.addTeamMember(team.id, workspaceId, userId);
      }),
    );

    return team;
  }

  async updateTeam(
    teamRequestParams: TeamRequestParams,
    teamData: UpdateTeamDto,
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

  async updateTeamPreferences(
    teamRequestParams: TeamRequestParams,
    preferencesDto: UpdateTeamPreferencesDto,
  ): Promise<Team> {
    const team = await this.prisma.team.findUniqueOrThrow({
      where: {
        id: teamRequestParams.teamId,
      },
    });

    await this.prisma.team.update({
      where: {
        id: team.id,
      },
      data: {
        preferences: {
          ...(team.preferences as Record<string, string | boolean>),
          ...preferencesDto,
        },
      },
    });

    return team;
  }

  async deleteTeam(teamRequestParams: TeamRequestParams): Promise<Team> {
    const teamIssues = await this.prisma.issue.findMany({
      where: {
        teamId: teamRequestParams.teamId,
      },
    });

    if (teamIssues.length > 0) {
      throw new BadRequestException(
        'There are issues in this team, remove them before you delete',
      );
    }

    // First, get all users who have this team
    const usersWithTeam = await this.prisma.usersOnWorkspaces.findMany({
      where: {
        teamIds: {
          has: teamRequestParams.teamId,
        },
      },
    });

    // Update each user to remove the team ID
    await Promise.all(
      usersWithTeam.map((user) =>
        this.prisma.usersOnWorkspaces.update({
          where: {
            id: user.id,
          },
          data: {
            teamIds: {
              set: user.teamIds.filter((id) => id !== teamRequestParams.teamId),
            },
          },
        }),
      ),
    );

    return await this.prisma.team.update({
      where: {
        id: teamRequestParams.teamId,
      },
      data: {
        deleted: new Date().toISOString(),
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
    workspaceId: string,
    teamMemberData: UserIdParams,
  ): Promise<UsersOnWorkspaces> {
    const userOnWorkspace = await this.prisma.usersOnWorkspaces.findUnique({
      where: {
        userId_workspaceId: {
          userId: teamMemberData.userId,
          workspaceId,
        },
      },
    });

    const issues = await this.prisma.issue.findMany({
      where: {
        assigneeId: userOnWorkspace.userId,
        teamId: teamRequestParams.teamId,
      },
    });

    if (issues.length > 0) {
      throw new BadRequestException('There are issues assigned to this user');
    }

    const updatedTeamIds = userOnWorkspace.teamIds.filter(
      (id) => id !== teamRequestParams.teamId,
    );

    return await this.prisma.usersOnWorkspaces.update({
      where: {
        userId_workspaceId: {
          userId: teamMemberData.userId,
          workspaceId,
        },
      },
      data: { teamIds: updatedTeamIds },
      include: { user: true },
    });
  }
}
