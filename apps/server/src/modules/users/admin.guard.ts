import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RoleEnum } from '@tegonhq/types';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extract the SuperTokens session from the request
    const session: SessionContainer = request.session;
    const role = session.getAccessTokenPayload().role;

    return role === RoleEnum.ADMIN;
  }
}
