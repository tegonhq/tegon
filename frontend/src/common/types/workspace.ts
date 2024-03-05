/** Copyright (c) 2024, Tegon, all rights reserved. **/

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

  userId: string;
  workspaceId: string;
  teamIds: string[];
}
