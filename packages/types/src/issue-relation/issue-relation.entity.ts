import { Issue } from '../issue';

export const IssueRelationType = {
  BLOCKS: 'BLOCKS',
  BLOCKED: 'BLOCKED',
  RELATED: 'RELATED',
  DUPLICATE: 'DUPLICATE',
  DUPLICATE_OF: 'DUPLICATE_OF',
  SIMILAR: 'SIMILAR',
};

export enum IssueRelationEnum {
  BLOCKS = 'BLOCKS',
  BLOCKED = 'BLOCKED',
  RELATED = 'RELATED',
  DUPLICATE = 'DUPLICATE',
  DUPLICATE_OF = 'DUPLICATE_OF',
  SIMILAR = 'SIMILAR',
}

export type IssueRelationType =
  (typeof IssueRelationType)[keyof typeof IssueRelationType];

export class IssueRelation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  issue?: Issue;
  issueId: string;
  relatedIssueId: string;

  type: IssueRelationType;
  metadata: any | null;
  createdById: string | null;
  deletedById: string | null;
  deleted: Date | null;
}
