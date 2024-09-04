import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetUsersDto, PublicUser, User } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';

import {
  generateKeyForUserId,
  generatePersonalAccessToken,
} from 'common/authentication';

import { LoggerService } from 'modules/logger/logger.service';

import {
  UpdateUserBody,
  userSerializer,
  UserWithInvites,
} from './user.interface';

@Injectable()
export class UsersService {
  private readonly logger = new LoggerService(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async upsertUser(
    id: string,
    email: string,
    fullname: string,
    username?: string,
  ) {
    try {
      return await this.prisma.user.upsert({
        where: { email },
        create: {
          id,
          email,
          fullname,
          username: username ?? email.split('@')[0],
        },
        update: {},
      });
    } catch (error) {
      this.logger.error({
        message: `Error while upserting the user with id: ${id}`,
        where: `UsersService.upsertUser`,
        error,
      });
      throw new InternalServerErrorException(
        error,
        `Error while upserting the user with id: ${id}`,
      );
    }
  }

  async getUser(id: string): Promise<UserWithInvites> {
    this.logger.debug({
      message: `fetching user with id ${id}`,
      payload: { id },
      where: `UsersService.getUser`,
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        usersOnWorkspaces: {
          include: {
            workspace: true,
          },
        },
      },
    });

    const invites = await this.getInvitesForUser(user.email);
    const serializeUser = userSerializer(user);
    return { ...serializeUser, invites };
  }

  async getUsersbyId(getUsersDto: GetUsersDto): Promise<PublicUser[]> {
    const where: Prisma.UserWhereInput = {
      id: { in: getUsersDto.userIds },
    };

    if (getUsersDto.workspaceId) {
      where.usersOnWorkspaces = {
        some: { workspaceId: getUsersDto.workspaceId },
      };
    }

    const users = await this.prisma.user.findMany({
      where,
      include: {
        usersOnWorkspaces: true,
      },
    });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      // This default takes the first workspace
      role: user.usersOnWorkspaces[0].role,
    }));
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        usersOnWorkspaces: {
          include: {
            workspace: true,
          },
        },
      },
    });

    return userSerializer(user);
  }
  async updateUser(id: string, updateData: UpdateUserBody) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateData,
      },
      include: {
        usersOnWorkspaces: {
          include: {
            workspace: true,
          },
        },
      },
    });
    return userSerializer(user);
  }

  async getInvitesForUser(email: string) {
    const invites = await this.prisma.invite.findMany({
      where: { emailId: email, deleted: null },
    });

    return await Promise.all(
      invites.map(async (invite) => {
        const workspace = await this.prisma.workspace.findUnique({
          where: { id: invite.workspaceId },
        });

        return { ...invite, workspace };
      }),
    );
  }

  async createPersonalAcccessToken(
    name: string,
    userId: string,
    type = 'user',
  ) {
    const jwt = await generateKeyForUserId(userId);
    const token = generatePersonalAccessToken();

    await this.prisma.personalAccessToken.create({
      data: {
        name,
        userId,
        token,
        jwt,
        type,
      },
    });

    return { name, token };
  }

  async getPats(userId: string) {
    const pats = (
      await this.prisma.personalAccessToken.findMany({
        where: { userId, type: 'user', deleted: null },
      })
    ).map((pat) => ({ name: pat.name, id: pat.id }));

    return pats;
  }

  async deletePat(patId: string) {
    await this.prisma.personalAccessToken.update({
      where: { id: patId },
      data: {
        deleted: new Date(),
      },
    });
  }

  async getJwtFromPat(token: string) {
    const pat = await this.prisma.personalAccessToken.findFirst({
      where: { token, deleted: null },
    });

    return pat.jwt;
  }
}
