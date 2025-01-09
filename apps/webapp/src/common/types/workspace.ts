import type { PriorityType } from '@tegonhq/types';

export interface WorkspaceType {
  id: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  name: string;
  actionsEnabled: boolean;
  preferences: {
    priorityType?: PriorityType;
  };
}

export interface UsersOnWorkspaceType {
  id: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  status: string;

  userId: string;
  workspaceId: string;
  teamIds: string[];
  settings: {
    ai?: boolean;
  };
}
