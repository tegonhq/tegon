/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import supertokens from 'supertokens-node';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { SupertokensService } from 'modules/auth/supertokens/supertokens.service';

import { PublicUser, UpdateUserBody, userSerializer } from './user.interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async upsertUser(id: string, email: string, fullname: string) {
    return await this.prisma.user.upsert({
      where: { email },
      create: {
        id,
        email,
        fullname,
        username: email.split('@')[0],
        role: 'ADMIN',
      },
      update: {},
    });
  }

  async getUser(id: string): Promise<User> {
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

    return userSerializer(user);
  }

  async getUsersbyId(ids: string[]): Promise<PublicUser[]> {
    return await this.prisma.user.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        email: true,
      },
    });
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
}
