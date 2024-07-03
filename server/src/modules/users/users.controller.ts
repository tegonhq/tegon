/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { User } from '@@generated/user/entities';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';
import { SupertokensService } from 'modules/auth/supertokens/supertokens.service';

import {
  PublicUser,
  UpdateUserBody,
  UserIdParams,
  UserIdsBody,
  UserWithInvites,
} from './user.interface';
import { UsersService } from './users.service';

@Controller({
  version: '1',
  path: 'users',
})
@ApiTags('Users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private supertokensService: SupertokensService,
  ) {}

  @Get()
  @UseGuards(new AuthGuard())
  async getUser(
    @SessionDecorator() session: SessionContainer,
  ): Promise<UserWithInvites> {
    const userId = session.getUserId();
    const user = await this.usersService.getUser(userId);

    return user;
  }

  @Post()
  @UseGuards(new AuthGuard())
  async getUsersById(@Body() userIdsBody: UserIdsBody): Promise<PublicUser[]> {
    return await this.usersService.getUsersbyId(userIdsBody.userIds);
  }

  @Get('email')
  @UseGuards(new AuthGuard())
  async getUserByEmail(@Query('email') email: string): Promise<User> {
    const user = await this.usersService.getUserByEmail(email);
    return user;
  }

  @Post('change_password')
  @UseGuards(new AuthGuard())
  async changePassword(
    @SessionDecorator() session: SessionContainer,
    @Body() passwordBody: Record<string, string>,
  ) {
    const userId = session.getUserId();
    return await this.usersService.changePassword(
      this.supertokensService,
      userId,
      session,
      passwordBody,
    );
  }

  @Post('forgot_password')
  async sendPasswordResetEmail(@Body() forgotBody: Record<string, string>) {
    return await this.usersService.sendPasswordResetEmail(
      this.supertokensService,
      forgotBody.email,
    );
  }

  @Post('forgot_password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.usersService.resetPassword(
      this.supertokensService,
      token,
      newPassword,
    );
  }

  @Post(':userId')
  @UseGuards(new AuthGuard())
  async updateUser(
    @Param() userIdBody: UserIdParams,
    @Body()
    updateUserBody: UpdateUserBody,
  ): Promise<User> {
    const user = await this.usersService.updateUser(
      userIdBody.userId,
      updateUserBody,
    );

    return user;
  }
}
