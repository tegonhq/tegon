import { Issue } from '../issue';
import { People } from '../people';

export class Support {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  reportedBy?: People;
  reportedById?: string;

  slaStatus?: string;
  slaPriority?: string;
  firstResponseAt?: Date;
  resolvedAt?: Date;
  dueBy?: Date;

  metadata?: any;

  issue: Issue;
  issueId: string;
}
