import { JsonValue } from '../common';
import { Role } from '../invite';
import { User } from '../user';
import { Workspace } from '../workspace';

export enum WorkspaceStatus {
  INVITED = 'INVITED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

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
