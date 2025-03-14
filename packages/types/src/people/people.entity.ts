import { Company } from '../company';
import { Support } from '../support';

export class People {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  name: string;
  email: string;
  phone?: string;

  metadata?: any;

  company?: Company;
  companyId?: string;

  reportedIssues?: Support[];
}
