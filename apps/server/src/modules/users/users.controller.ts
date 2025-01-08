import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  CodeDto,
  CodeDtoWithWorkspace,
  CreatePatDto,
  GetUsersDto,
  PatIdDto,
  PublicUser,
  User,
} from '@tegonhq/types';
import { Response } from 'express';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { AuthGuard } from 'modules/auth/auth.guard';
import {
  Session as SessionDecorator,
  UserId,
  Workspace,
} from 'modules/auth/session.decorator';

import { UpdateUserBody, UserWithInvites } from './users.interface';
import { UsersService } from './users.service';

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUser(
    @SessionDecorator() session: SessionContainer,
    @Query() userIdParams: { userIds: string },
    @Workspace() workspaceId: string,
  ): Promise<UserWithInvites | PublicUser[]> {
    try {
      if (userIdParams.userIds && userIdParams.userIds.split(',').length > 0) {
        return await this.users.getUsersbyId(
          {
            userIds: userIdParams.userIds.split(','),
          },
          workspaceId,
        );
      }
    } catch (e) {}

    const userId = session.getUserId();
    const user = await this.users.getUser(userId);

    return user;
  }

  @Post()
  @UseGuards(AuthGuard)
  async getUsersById(
    @Body() getUsersDto: GetUsersDto,
    @Workspace() workspaceId: string,
  ): Promise<PublicUser[]> {
    return await this.users.getUsersbyId(getUsersDto, workspaceId);
  }

  @Post('impersonate')
  @UseGuards(AuthGuard)
  async impersonate(
    @Body() { key, userId }: { key: string; userId: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.users.impersonate(key, userId, res, req);
  }

  @Post('pat')
  @UseGuards(AuthGuard)
  async createPersonalAccessToken(
    @Workspace() workspaceId: string,
    @SessionDecorator() session: SessionContainer,
    @Body()
    createPatDto: CreatePatDto,
  ) {
    const userId = session.getUserId();
    const user = await this.users.createPersonalAccessToken(
      createPatDto.name,
      userId,
      workspaceId,
    );

    return user;
  }

  @Post('pat-for-code')
  async getPatForCode(
    @Body()
    codeBody: CodeDto,
  ) {
    return await this.users.getPersonalAccessTokenFromAuthorizationCode(
      codeBody.code,
    );
  }

  @Get('pats')
  @UseGuards(AuthGuard)
  async getPats(@SessionDecorator() session: SessionContainer) {
    const userId = session.getUserId();
    return await this.users.getPats(userId);
  }

  @Delete('pats/:patId')
  @UseGuards(AuthGuard)
  async deletePat(@Param() patIdDto: PatIdDto) {
    return await this.users.deletePat(patIdDto.patId);
  }

  @Get('authorization')
  async createAuthorizationCode(): Promise<CodeDto> {
    return this.users.generateAuthorizationCode();
  }

  @Post('authorization')
  @UseGuards(AuthGuard)
  async authorizeCode(
    @SessionDecorator() session: SessionContainer,
    @Body()
    codeBody: CodeDtoWithWorkspace,
  ) {
    const userId = session.getUserId();
    return this.users.authorizeCode(userId, codeBody);
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateUser(
    @UserId() userId: string,
    @Body()
    updateUserBody: UpdateUserBody,
  ): Promise<User> {
    const user = await this.users.updateUser(userId, updateUserBody);
    return user;
  }
}
