import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import WorkspacesService from 'modules/workspaces/workspaces.service';
@Injectable()
export class ActionGuard implements CanActivate {
  constructor(private workspaceService: WorkspacesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const workspaceId = request.body.workspaceId || request.query.workspaceId;

    if (!workspaceId) {
      return false;
    }

    const workspace = await this.workspaceService.getWorkspace(workspaceId);
    return workspace.actionsEnabled;
  }
}
