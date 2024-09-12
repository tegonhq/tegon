import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import {
  CodeDtoWithWorkspace,
  GetUsersDto,
  PublicUser,
  RoleEnum,
  User,
} from '@tegonhq/types';
import { Response } from 'express';
import { PrismaService } from 'nestjs-prisma';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';

import {
  generateKeyForUserId,
  generatePersonalAccessToken,
} from 'common/authentication';

import { LoggerService } from 'modules/logger/logger.service';

import {
  UpdateUserBody,
  userSerializer,
  UserWithInvites,
} from './users.interface';
import { generateUniqueId } from './users.utils';

@Injectable()
export class UsersService {
  private readonly logger = new LoggerService(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

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
      image: user.image,
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

  async checkifAdmin(userId: string, workspaceId: string) {
    try {
      const userOnWorkspace = await this.prisma.usersOnWorkspaces.findFirst({
        where: {
          userId,
          workspaceId,
        },
      });

      if (!userOnWorkspace) {
        throw new NotFoundException('User not found in workspace');
      }

      return userOnWorkspace.role === RoleEnum.ADMIN;
    } catch (e) {
      throw new BadRequestException('Forbidden');
    }
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

  async createPersonalAccessToken(
    name: string,
    userId: string,
    workspaceId: string,
    type = 'user',
  ) {
    const jwt = await generateKeyForUserId(userId);
    const token = generatePersonalAccessToken();

    const pat = await this.prisma.personalAccessToken.create({
      data: {
        name,
        userId,
        token,
        workspaceId,
        jwt,
        type,
      },
    });

    return { name, token, id: pat.id };
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

  // Authorization code
  // Used in cli
  async generateAuthorizationCode() {
    return this.prisma.authorizationCode.create({
      data: {
        code: generateUniqueId(),
      },
      select: {
        code: true,
      },
    });
  }

  async authorizeCode(userId: string, codeBody: CodeDtoWithWorkspace) {
    // only allow authorization codes that were created less than 10 mins ago
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const code = await this.prisma.authorizationCode.findFirst({
      where: {
        code: codeBody.code,
        personalAccessTokenId: null,
        createdAt: {
          gte: tenMinutesAgo,
        },
      },
    });

    if (!code) {
      throw new Error(
        'Invalid authorization code, code already used, or code expired',
      );
    }

    const existingCliPersonalAccessToken =
      await this.prisma.personalAccessToken.findFirst({
        where: {
          userId,
          type: 'cli',
        },
      });

    // we only allow you to have one CLI PAT at a time, so return this
    if (existingCliPersonalAccessToken) {
      // associate this authorization code with the existing personal access token
      await this.prisma.authorizationCode.updateMany({
        where: {
          code: codeBody.code,
        },
        data: {
          personalAccessTokenId: existingCliPersonalAccessToken.id,
          workspaceId: codeBody.workspaceId,
        },
      });

      if (existingCliPersonalAccessToken.deleted) {
        // re-activate revoked CLI PAT so we can use it again
        await this.prisma.personalAccessToken.update({
          where: {
            id: existingCliPersonalAccessToken.id,
          },
          data: {
            deleted: null,
          },
        });
      }

      // we don't return the decrypted token
      return {
        id: existingCliPersonalAccessToken.id,
        name: existingCliPersonalAccessToken.name,
        userId: existingCliPersonalAccessToken.userId,
      };
    }

    const token = await this.createPersonalAccessToken('cli', userId, 'cli');

    await this.prisma.authorizationCode.updateMany({
      where: {
        code: codeBody.code,
      },
      data: {
        personalAccessTokenId: token.id,
        workspaceId: codeBody.workspaceId,
      },
    });

    return token;
  }

  /** Gets a PersonalAccessToken from an Auth Code, this only works within 10 mins of the auth code being created */
  async getPersonalAccessTokenFromAuthorizationCode(authorizationCode: string) {
    // only allow authorization codes that were created less than 10 mins ago
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const code = await this.prisma.authorizationCode.findFirst({
      where: {
        code: authorizationCode,
        createdAt: {
          gte: tenMinutesAgo,
        },
      },
    });
    if (!code) {
      throw new Error('Invalid authorization code, or code expired');
    }

    if (!code.personalAccessTokenId) {
      throw new Error('No personal token found');
    }

    const pat = await this.prisma.personalAccessToken.findUnique({
      where: { id: code.personalAccessTokenId },
    });

    // there's no PersonalAccessToken associated with this code
    if (!pat) {
      return {
        token: null,
        workspaceId: undefined,
      };
    }

    return {
      token: pat.token,
      workspaceId: code.workspaceId,
    };
  }

  // Impersonate into accounts for better support
  async impersonate(key: string, userId: string, res: Response, req: Request) {
    if (key !== this.config.get('POSTGRES_PASSWORD')) {
      throw new BadRequestException('Wrong URL');
    }

    const user = this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await Session.createNewSession(
      req,
      res,
      'public',
      supertokens.convertToRecipeUserId(userId),
    );

    res.send({ status: 200, message: 'impersonate' });
  }
}
