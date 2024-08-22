import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreatePatDto,
  GetUsersDto,
  PatIdDto,
  PublicUser,
  User,
} from '@tegonhq/types';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';
import { SupertokensService } from 'modules/auth/supertokens/supertokens.service';

import {
  UpdateUserBody,
  UserIdParams,
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
  @UseGuards(AuthGuard)
  async getUser(
    @SessionDecorator() session: SessionContainer,
  ): Promise<UserWithInvites> {
    const userId = session.getUserId();
    const user = await this.usersService.getUser(userId);

    return user;
  }

  @Post()
  @UseGuards(AuthGuard)
  async getUsersById(@Body() getUsersDto: GetUsersDto): Promise<PublicUser[]> {
    return await this.usersService.getUsersbyId(getUsersDto);
  }

  @Get('email')
  @UseGuards(AuthGuard)
  async getUserByEmail(@Query('email') email: string): Promise<User> {
    const user = await this.usersService.getUserByEmail(email);
    return user;
  }

  @Post('change_password')
  @UseGuards(AuthGuard)
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

  @Post('pat')
  @UseGuards(AuthGuard)
  async createPersonalAccessToken(
    @SessionDecorator() session: SessionContainer,
    @Body()
    createPatDto: CreatePatDto,
  ) {
    const userId = session.getUserId();
    const user = await this.usersService.createPersonalAcccessToken(
      createPatDto.name,
      userId,
    );

    return user;
  }

  @Get('pats')
  @UseGuards(AuthGuard)
  async getPats(@SessionDecorator() session: SessionContainer) {
    const userId = session.getUserId();
    return await this.usersService.getPats(userId);
  }

  @Delete('pats/:patId')
  @UseGuards(AuthGuard)
  async deletePat(@Param() patIdDto: PatIdDto) {
    return await this.usersService.deletePat(patIdDto.patId);
  }

  @Post(':userId')
  @UseGuards(AuthGuard)
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
