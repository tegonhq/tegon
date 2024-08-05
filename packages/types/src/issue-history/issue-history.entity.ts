import { JsonValue } from '../common';
import { Issue } from '../issue';

export class IssueHistory {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  userId: string | null;
  issue?: Issue;
  issueId: string;
  sourceMetaData: JsonValue | null;
  addedLabelIds: string[];
  removedLabelIds: string[];
  fromPriority: number | null;
  toPriority: number | null;
  fromStateId: string | null;
  toStateId: string | null;
  fromEstimate: number | null;
  toEstimate: number | null;
  fromAssigneeId: string | null;
  toAssigneeId: string | null;
  fromParentId: string | null;
  toParentId: string | null;
  fromTeamId: string | null;
  toTeamId: string | null;
  relationChanges: JsonValue | null;
}
