/** Copyright (c) 2024, Tegon, all rights reserved. **/

export enum IssueRelationEnum {
  BLOCKS = 'BLOCKS',
  BLOCKED = 'BLOCKED',
  RELATED = 'RELATED',
  DUPLICATE = 'DUPLICATE',
  DUPLICATE_OF = 'DUPLICATE_OF',
  PARENT = 'PARENT',
  SUB_ISSUE = 'SUB_ISSUE',
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
