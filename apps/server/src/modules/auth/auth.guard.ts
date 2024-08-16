import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Optional,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { VerifySessionOptions } from 'supertokens-node/recipe/session';

import { isSessionValid } from 'common/authentication';

import { UsersService } from 'modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private moduleRef: ModuleRef,
    @Optional() private readonly verifyOptions?: VerifySessionOptions,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    const resp = ctx.getResponse();
    const request = ctx.getRequest();

    const usersService = await this.moduleRef.resolve(UsersService);

    return isSessionValid(request, resp, this.verifyOptions, usersService);
  }
}
