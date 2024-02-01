/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UpdateUserBody } from './user.interface';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        UsersOnWorkspaces: true,
      },
    });
  }

  async updateUser(id: string, updateData: UpdateUserBody) {
    return await this.prisma.user.update({
      where: {
        id
      },
      data: {
        ...updateData
      },
      include: {
        UsersOnWorkspaces: true
      }
    })
  }
}
