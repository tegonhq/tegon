export interface CompanyType {
  id: string;
  createdAt: string;
  updatedAt: string;

  name: string;
  domain?: string;
  website?: string;
  description?: string;
  logo?: string;
  industry?: string;
  size?: string;
  type?: string;

  metadata?: string;
  workspaceId: string;
}
