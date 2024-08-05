import { JsonValue } from '../common';
import { Issue } from '../issue';

export class LinkedIssue {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  url: string;
  sourceId: string | null;
  source: JsonValue | null;
  sourceData: JsonValue | null;
  createdById: string | null;
  issue?: Issue;
  issueId: string;
}
