import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { VerifySessionOptions } from 'supertokens-node/recipe/session';

import { isSessionValid } from 'common/authentication';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly verifyOptions?: VerifySessionOptions) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    const resp = ctx.getResponse();
    const request = ctx.getRequest();

    return isSessionValid(request, resp, this.verifyOptions);
  }
}
