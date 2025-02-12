import { People } from '../people';
import { Workspace } from '../workspace';

export class Company {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  name: string;
  domain?: string;
  website?: string;
  description?: string;

  industry?: string;
  size?: string;
  type?: string;
  metadata?: any;

  people?: People[];
  workspace: Workspace;
  workspaceId: string;
}
