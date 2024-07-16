import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  InviteStatus,
  Status,
  UsersOnWorkspaces,
  Workspace,
} from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { UsersService } from 'modules/users/users.service';

import {
  CreateWorkspaceInput,
  InviteUsersBody,
  UpdateWorkspaceInput,
  UserWorkspaceOtherData,
  WorkspaceIdRequestBody,
  integrationDefinitionSeedData,
  labelSeedData,
} from './workspaces.interface';

@Injectable()
export default class WorkspacesService {
  private readonly logger: Logger = new Logger('WorkspaceService');
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private usersService: UsersService,
  ) {}

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
        integrationDefinition: { create: integrationDefinitionSeedData },
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

  async getAllWorkspaces(userId: string): Promise<Workspace[]> {
    return await this.prisma.workspace.findMany({
      where: {
        usersOnWorkspaces: { every: { userId } },
      },
    });
  }

  async getWorkspace(
    WorkspaceIdRequestBody: WorkspaceIdRequestBody,
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
    WorkspaceIdRequestBody: WorkspaceIdRequestBody,
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
    WorkspaceIdRequestBody: WorkspaceIdRequestBody,
  ): Promise<Workspace> {
    return await this.prisma.workspace.delete({
      where: {
        id: WorkspaceIdRequestBody.workspaceId,
      },
    });
  }

  async seedWorkspaces(): Promise<void> {
    const workspaces = await this.prisma.workspace.findMany();

    workspaces.map(async (workspace) => {
      await this.prisma.workspace.update({
        where: { id: workspace.id },
        data: {
          integrationDefinition: {
            createMany: {
              data: integrationDefinitionSeedData,
              skipDuplicates: true,
            },
          },
        },
      });
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
        const invite = await this.prisma.invite.create({
          data: {
            emailId: email,
            fullName: email.split('@')[0],
            workspaceId,
            sentAt: new Date().toISOString(),
            expiresAt: new Date(),
            status: InviteStatus.INVITED,
            teamIds,
            role,
          },
        });

        await this.mailerService.sendMail({
          to: email,
          subject: `Invite to ${workspace.name}`,
          template: 'inviteUser',
          context: {
            workspaceName: workspace.name,
            inviterName: iniviter.fullname,
            invitationUrl: `${process.env.PUBLIC_FRONTEND_HOST}/auth/signup?token=${invite.id}&email=${email}`,
          },
        });
        this.logger.log('Invite Email sent to user');

        responseRecord[email] = 'Success';
      } catch (error) {
        responseRecord[email] = error;
      }
    }

    return responseRecord;
  }

  async getInvites(workspaceId: string) {
    return await this.prisma.invite.findMany({
      where: { workspaceId, status: { not: InviteStatus.ACCEPTED } },
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
        data: { status: InviteStatus.ACCEPTED },
      });

      await this.addUserToWorkspace(invite.workspaceId, userId, {
        teamIds: invite.teamIds,
        joinedAt: new Date().toISOString(),
        role: invite.role,
        status: Status.ACTIVE,
      });
    }

    return await this.prisma.invite.update({
      where: { id: inviteId },
      data: {
        status: InviteStatus.ACCEPTED,
        deleted: new Date().toISOString(),
      },
    });
  }
}
