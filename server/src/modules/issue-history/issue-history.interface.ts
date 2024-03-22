/** Copyright (c) 2024, Tegon, all rights reserved. **/

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
}
