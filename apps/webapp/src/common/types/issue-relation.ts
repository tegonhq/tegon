export enum IssueRelationEnum {
  BLOCKS = 'BLOCKS',
  BLOCKED = 'BLOCKED',
  RELATED = 'RELATED',
  DUPLICATE = 'DUPLICATE',
  DUPLICATE_OF = 'DUPLICATE_OF',
  PARENT = 'PARENT',
  SUB_ISSUE = 'SUB_ISSUE',
  SIMILAR = 'SIMILAR',
}

export interface IssueRelationType {
  id: string;
  createdAt: string;
  updatedAt: string;

  issueId: string;
  createdById: string;
  relatedIssueId: string;
  type: IssueRelationEnum;
}
