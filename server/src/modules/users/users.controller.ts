/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { User } from '@@generated/user/entities';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

import { UsersService } from './users.service';
import { UpdateUserBody, UserIdParams } from './user.interface';

@Controller({
  version: '1',
  path: 'users',
})
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(new AuthGuard())
  async getUser(@SessionDecorator() session: SessionContainer): Promise<User> {
    const userId = session.getUserId();
    const user = await this.usersService.getUser(userId);

    return user;
  }

  @Post(':userId')
  @UseGuards(new AuthGuard())
  async updateUser(
      @Param() userIdBody: UserIdParams,
      @Body()
      updateUserBody: UpdateUserBody,
  ): Promise<User> {
    const user = await this.usersService.updateUser(userIdBody.userId, updateUserBody);

    return user;
  }
}
