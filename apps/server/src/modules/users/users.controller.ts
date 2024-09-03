import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  CreatePatDto,
  GetUsersDto,
  PatIdDto,
  PublicUser,
  User,
} from '@tegonhq/types';
import { Response } from 'express';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';

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
export class UsersController {
  constructor(private usersService: UsersService) {}

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

  @Get('impersonate/:userId')
  @UseGuards(AuthGuard)
  async impersonate(
    @Param() userIdBody: UserIdParams,
    @Query() { key }: { key: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.usersService.impersonate(key, userIdBody.userId, res, req);
  }
}
