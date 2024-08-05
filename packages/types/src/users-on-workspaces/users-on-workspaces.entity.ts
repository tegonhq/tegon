import { JsonValue } from '../common';
import { Role } from '../invite';
import { User } from '../user';
import { Workspace } from '../workspace';

export enum WorkspaceStatusEnum {
  INVITED = 'INVITED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export const WorkspaceStatus = {
  INVITED: 'INVITED',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
};

export type WorkspaceStatus =
  (typeof WorkspaceStatus)[keyof typeof WorkspaceStatus];

export class UsersOnWorkspaces {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  workspace?: Workspace;
  userId: string;
  workspaceId: string;
  teamIds: string[];
  status: WorkspaceStatus;
  externalAccountMappings: JsonValue | null;
  role: Role;
  joinedAt: Date | null;
}
