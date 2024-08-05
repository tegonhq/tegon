export interface WorkspaceType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date;

  slug: string;
  name: string;
  icon?: string;
}

export interface UsersOnWorkspaceType {
  id: string;
  createdAt: string;
  updatedAt: string;

  userId: string;
  workspaceId: string;
  teamIds: string[];
}
