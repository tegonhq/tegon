import { Issue, IssueRelation } from '@tegonhq/types';

export enum ReverseIssueRelationType {
  BLOCKS = 'BLOCKED',
  BLOCKED = 'BLOCKS',
  RELATED = 'RELATED',
  DUPLICATE = 'DUPLICATE_OF',
  DUPLICATE_OF = 'DUPLICATE',
  SIMILAR = 'SIMILAR',
}

export interface IssueRelationWithIssue extends IssueRelation {
  issue: Issue;
}
