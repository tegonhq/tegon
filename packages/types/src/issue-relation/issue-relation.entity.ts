import { JsonValue } from '../common';
import { Issue } from '../issue';

export enum IssueRelationType {
  BLOCKS = 'BLOCKS',
  BLOCKED = 'BLOCKED',
  RELATED = 'RELATED',
  DUPLICATE = 'DUPLICATE',
  DUPLICATE_OF = 'DUPLICATE_OF',
  SIMILAR = 'SIMILAR',
}

export class IssueRelation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  issue?: Issue;
  issueId: string;
  relatedIssueId: string;
  type: IssueRelationType;
  metadata: JsonValue | null;
  createdById: string | null;
  deletedById: string | null;
  deleted: Date | null;
}
