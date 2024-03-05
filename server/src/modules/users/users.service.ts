/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { PublicUser, UpdateUserBody, userSerializer } from './user.interface';
import { User } from '@prisma/client';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
    const user = await this.prisma.user.findMany({
      where: {
        id: {in: ids}
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        email: true,
      },
    });

    return user;
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
}
