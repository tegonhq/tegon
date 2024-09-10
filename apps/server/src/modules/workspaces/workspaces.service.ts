import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  InviteStatusEnum,
  RoleEnum,
  UsersOnWorkspaces,
  Workspace,
  WorkspaceRequestParamsDto,
  WorkspaceStatusEnum,
} from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { createMagicLink } from 'common/utils/login';

import { LoggerService } from 'modules/logger/logger.service';
import { workflowSeedData } from 'modules/teams/teams.interface';
import { UsersService } from 'modules/users/users.service';

import {
  CreateInitialResourcesDto,
  CreateWorkspaceInput,
  InviteUsersBody,
  UpdateWorkspaceInput,
  UserWorkspaceOtherData,
  labelSeedData,
  promptsSeedData,
} from './workspaces.interface';

@Injectable()
export default class WorkspacesService {
  private readonly logger: LoggerService = new LoggerService(
    'WorkspaceService',
  );
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private usersService: UsersService,
  ) {}

  async createInitialResources(
    userId: string,
    workspaceData: CreateInitialResourcesDto,
  ): Promise<Workspace> {
    const workspace = await this.prisma.usersOnWorkspaces.findFirst({
      where: { userId },
    });

    if (workspace) {
      throw new BadRequestException('Already workspace exist');
    }

    return await this.prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { id: userId },
        data: {
          fullname: workspaceData.fullname,
        },
      });

      const workspace = await prisma.workspace.create({
        data: {
          name: workspaceData.workspaceName,
          slug: workspaceData.workspaceName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ''),
          preferences: {
            actionCount: 2,
          },
          usersOnWorkspaces: {
            create: { userId },
          },
          team: {
            create: {
              name: workspaceData.teamName,
              identifier: workspaceData.teamIdentifier,
              workflow: { create: workflowSeedData },
            },
          },
          label: { create: labelSeedData },
          prompts: {
            createMany: {
              data: promptsSeedData,
              skipDuplicates: true,
            },
          },
        },
        include: {
          team: true,
          usersOnWorkspaces: true,
        },
      });

      await prisma.usersOnWorkspaces.update({
        where: { userId_workspaceId: { userId, workspaceId: workspace.id } },
        data: { teamIds: [workspace.team[0].id] },
      });

      return workspace;
    });
  }

  async createWorkspace(
    userId: string,
    workspaceData: CreateWorkspaceInput,
  ): Promise<Workspace> {
    const workspace = await this.prisma.workspace.create({
      data: {
        ...workspaceData,
        usersOnWorkspaces: {
          create: { userId },
        },
        label: { create: labelSeedData },
      },
      include: {
        usersOnWorkspaces: true,
      },
    });

    return workspace;
  }

  async getWorkspaceByName(name: string): Promise<Workspace> {
    return await this.prisma.workspace.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
      include: {
        usersOnWorkspaces: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async getWorkspaceBySlug(slug: string): Promise<Workspace> {
    return await this.prisma.workspace.findFirst({
      where: {
        name: {
          equals: slug,
          mode: 'insensitive',
        },
      },
      include: {
        usersOnWorkspaces: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async getAllWorkspaces(userId: string): Promise<Workspace[]> {
    return await this.prisma.workspace.findMany({
      where: {
        usersOnWorkspaces: { every: { userId } },
      },
    });
  }

  async getWorkspace(
    WorkspaceIdRequestBody: WorkspaceRequestParamsDto,
  ): Promise<Workspace> {
    return await this.prisma.workspace.findUnique({
      where: {
        id: WorkspaceIdRequestBody.workspaceId,
      },
      include: {
        usersOnWorkspaces: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async updateWorkspace(
    WorkspaceIdRequestBody: WorkspaceRequestParamsDto,
    workspaceData: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    return await this.prisma.workspace.update({
      data: workspaceData,
      where: {
        id: WorkspaceIdRequestBody.workspaceId,
      },
    });
  }

  async deleteWorkspace(
    WorkspaceIdRequestBody: WorkspaceRequestParamsDto,
  ): Promise<Workspace> {
    return await this.prisma.workspace.delete({
      where: {
        id: WorkspaceIdRequestBody.workspaceId,
      },
    });
  }

  async addUserToWorkspace(
    workspaceId: string,
    userId: string,
    otherData?: UserWorkspaceOtherData,
  ): Promise<UsersOnWorkspaces> {
    return await this.prisma.usersOnWorkspaces.upsert({
      where: {
        userId_workspaceId: { workspaceId, userId },
      },
      update: { ...otherData },
      create: { workspaceId, userId, ...otherData },
    });
  }

  async inviteUsers(
    session: SessionContainer,
    workspaceId: string,
    inviteUsersBody: InviteUsersBody,
  ): Promise<Record<string, string>> {
    const { emailIds, teamIds, role } = inviteUsersBody;
    const workspace = await this.getWorkspace({
      workspaceId,
    });
    const iniviter = await this.usersService.getUser(session.getUserId());

    const emails = emailIds.split(',');
    const responseRecord: Record<string, string> = {};

    for (const e of emails) {
      const email = e.trim();
      try {
        await this.prisma.invite.upsert({
          where: {
            emailId_workspaceId: {
              emailId: email,
              workspaceId,
            },
          },
          create: {
            emailId: email,
            fullName: email.split('@')[0],
            workspaceId,
            sentAt: new Date().toISOString(),
            expiresAt: new Date(),
            status: InviteStatusEnum.INVITED,
            teamIds,
            role,
          },
          update: {
            sentAt: new Date().toISOString(),
          },
        });

        const magicLink = await createMagicLink(email);

        await this.mailerService.sendMail({
          to: email,
          subject: `Invite to ${workspace.name}`,
          template: 'inviteUser',
          context: {
            workspaceName: workspace.name,
            inviterName: iniviter.fullname,
            invitationUrl: magicLink,
          },
        });
        this.logger.info({
          message: 'Invite Email sent to user',
          where: `WorkspacesService.inviteUsers`,
        });

        responseRecord[email] = 'Success';
      } catch (error) {
        responseRecord[email] = error;
      }
    }

    return responseRecord;
  }

  async getInvites(workspaceId: string) {
    return await this.prisma.invite.findMany({
      where: { workspaceId, status: { not: InviteStatusEnum.ACCEPTED } },
    });
  }

  async inviteAction(
    inviteId: string,
    userId: string,
    accepted: boolean = false,
  ) {
    if (accepted) {
      const invite = await this.prisma.invite.update({
        where: { id: inviteId },
        data: { status: InviteStatusEnum.ACCEPTED },
      });

      await this.addUserToWorkspace(invite.workspaceId, userId, {
        teamIds: invite.teamIds,
        joinedAt: new Date().toISOString(),
        role: invite.role as RoleEnum,
        status: WorkspaceStatusEnum.ACTIVE,
      });
    }

    return await this.prisma.invite.update({
      where: { id: inviteId },
      data: {
        status: InviteStatusEnum.ACCEPTED,
        deleted: new Date().toISOString(),
      },
    });
  }
}
