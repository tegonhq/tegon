import { JsonValue } from '../common';
import { Issue } from '../issue';

export class LinkedIssue {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  url: string;
  sourceId: string | null;
  sourceData: JsonValue | null;
  sync: boolean;
  createdById: string | null;
  updatedById: string;
  issue?: Issue;
  issueId: string;
}
