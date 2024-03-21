/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsString } from 'class-validator';

export interface IssueHistoryData {
  addedLabelIds: string[];
  removedLabelIds: string[];
  fromPriorityId: number;
  toPriorityId: number;
  fromStateId: string;
  toStateId: string;
  fromEstimate: number;
  toEstimate: number;
  fromAssigneeId: string;
  toAssigneeId: string;
  fromParentId: string;
  toParentId: string;
  relationChanges: JSON[];
}

export enum IssueRelationType {
  BLOCKS = 'BLOCKS',
  BLOCKED = 'BLOCKED',
  RELATED = 'RELATED',
  DUPLICATE = 'DUPLICATE',
  DUPLICATE_OF = 'DUPLICATE_OF',
}

export enum ReverseIssueRelationType {
  BLOCKS = 'BLOCKED',
  BLOCKED = 'BLOCKS',
  RELATED = 'RELATED',
  DUPLICATE = 'DUPLICATE_OF',
  DUPLICATE_OF = 'DUPLICATE',
}

export interface IssueRelation {
  type: IssueRelationType;
  issueId: string;
  relatedIssueId: string;
}

export class IssueHistoryIdRequestParams {
  @IsString()
  issueHistoryId: string;
}
