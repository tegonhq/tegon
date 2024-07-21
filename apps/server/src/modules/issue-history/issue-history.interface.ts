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
  fromTeamId: string;
  toTeamId: string;
}
