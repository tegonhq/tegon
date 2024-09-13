import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';

export const Session = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.session;
  },
);

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const session = request.session as SessionContainer;
    const userId = session.getUserId();

    return userId;
  },
);

export const Workspace = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const session = request.session as SessionContainer;
    const workspaceId = session.getAccessTokenPayload().workspaceId;

    return workspaceId;
  },
);

export const Role = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const session = request.session as SessionContainer;
    const role = session.getAccessTokenPayload().role;

    return role;
  },
);
