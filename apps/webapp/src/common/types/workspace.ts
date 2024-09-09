import type { RoleEnum } from '@tegonhq/types';

export interface WorkspaceType {
  id: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  name: string;
}

export interface UsersOnWorkspaceType {
  id: string;
  createdAt: string;
  updatedAt: string;
  role: RoleEnum;

  userId: string;
  workspaceId: string;
  teamIds: string[];
}
