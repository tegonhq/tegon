import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Prisma } from '@prisma/client';
import { GetUsersDto, PublicUser, User } from '@tegonhq/types';
import { PrismaService } from 'nestjs-prisma';
import supertokens from 'supertokens-node';
import { SessionContainer } from 'supertokens-node/recipe/session';

import {
  generateKeyForUserId,
  generatePersonalAccessToken,
} from 'common/authentication';

import { SupertokensService } from 'modules/auth/supertokens/supertokens.service';

import {
  UpdateUserBody,
  userSerializer,
  UserWithInvites,
} from './user.interface';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger('UserService');
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  async upsertUser(
    id: string,
    email: string,
    fullname: string,
    username?: string,
  ) {
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
  }

  async getUser(id: string): Promise<UserWithInvites> {
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

  async changePassword(
    supertokensService: SupertokensService,
    userId: string,
    session: SessionContainer,
    passwordBody: Record<string, string>,
  ) {
    const oldPassword = passwordBody.oldPassword;
    const newPassword = passwordBody.newPassword;

    const userInfo = await supertokens.getUser(userId);

    if (userInfo === undefined) {
      throw new BadRequestException('User not found');
    }

    const loginMethod = userInfo.loginMethods.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (lM: any) =>
        lM.recipeUserId.getAsString() ===
          session.getRecipeUserId().getAsString() &&
        lM.recipeId === 'emailpassword',
    );

    if (loginMethod === undefined) {
      throw new BadRequestException(`You've signed up with different method`);
    }
    const email = loginMethod.email;

    const EmailPassword = supertokensService.getEmailPasswordRecipe();

    const isPasswordValid = await EmailPassword.signIn(
      session!.getTenantId(),
      email,
      oldPassword,
    );

    if (isPasswordValid.status !== 'OK') {
      throw new BadRequestException(`Your current password didn't match`);
    }

    // update the user's password using updateEmailOrPassword
    const response = await EmailPassword.updateEmailOrPassword({
      recipeUserId: session.getRecipeUserId(),
      password: newPassword,
      tenantIdForPasswordPolicy: session.getTenantId(),
    });

    if (response.status === 'PASSWORD_POLICY_VIOLATED_ERROR') {
      // TODO: handle incorrect password error
      throw new BadRequestException(
        `Your new password didn't match with the policy`,
      );
    }

    return { message: 'Successful' };
  }

  async sendPasswordResetEmail(
    supertokensService: SupertokensService,
    email: string,
  ) {
    const EmailPassword = supertokensService.getEmailPasswordRecipe();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const response = await EmailPassword.createResetPasswordLink(
      undefined,
      user.id,
      email,
    );

    if (response.status === 'OK') {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Password Reset',
        template: 'resetPassword',
        context: {
          username: user.fullname,
          resetUrl: response.link,
        },
      });
      this.logger.log('Reset Email sent to user');
    }

    return response;
  }

  async resetPassword(
    supertokensService: SupertokensService,
    token: string,
    newPassword: string,
  ) {
    const EmailPassword = supertokensService.getEmailPasswordRecipe();

    const response = await EmailPassword.resetPasswordUsingToken(
      undefined,
      token,
      newPassword,
    );

    if (response.status === 'PASSWORD_POLICY_VIOLATED_ERROR') {
      throw new BadRequestException(
        `Your new password didn't match with the policy`,
      );
    } else if (response.status === 'RESET_PASSWORD_INVALID_TOKEN_ERROR') {
      throw new BadRequestException(`Invalid reset password token`);
    } else if (response.status === 'OK') {
      return { message: 'Successful' };
    }

    throw new BadRequestException(response.status);
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

  async createPersonalAcccessToken(name: string, userId: string) {
    const jwt = await generateKeyForUserId(userId);
    const token = generatePersonalAccessToken();

    await this.prisma.personalAccessToken.create({
      data: {
        name,
        userId,
        token,
        jwt,
      },
    });

    return { name, token };
  }

  async getPats(userId: string) {
    const pats = (
      await this.prisma.personalAccessToken.findMany({
        where: { userId, deleted: null },
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
