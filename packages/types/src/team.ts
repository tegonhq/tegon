export interface TeamType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date;

  name: string;
  identifier: string;
  icon: string;
  workspaceId: string;
}
