import { WorkspaceType } from './workspace';

interface Workspace {
  name: string;
  slug: string;
  icon: string;
  id: string;
}

export interface Invite {
  id: string;
  workspaceId: string;
  workspace: Workspace;
  status: 'ACCEPTED' | 'INVITED';
}

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  email: string;
  fullname: string;
  username: string;
  initialSetupComplete: boolean;
  anonymousDataCollection: boolean;

  workspaces?: WorkspaceType[];
  invites?: Invite[];
}
