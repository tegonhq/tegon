export interface PeopleType {
  id: string;
  createdAt: string;
  updatedAt: string;

  name: string;
  email: string;
  phone?: string;
  metadata?: string;
  companyId?: string;
  workspaceId: string;
}
