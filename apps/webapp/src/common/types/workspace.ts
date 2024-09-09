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
  role: string;

  userId: string;
  workspaceId: string;
  teamIds: string[];
}
