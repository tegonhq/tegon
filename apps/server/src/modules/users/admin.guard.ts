import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { UsersService } from './users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const users = await this.moduleRef.resolve(UsersService);
    // Extract the SuperTokens session from the request
    const session: SessionContainer = request.session;

    const workspaceId =
      request.body.workspaceId ||
      request.query.workspaceId ||
      request.params.workspaceId;

    if (!workspaceId) {
      return false;
    }

    return users.checkifAdmin(session.getUserId(), workspaceId);
  }
}
