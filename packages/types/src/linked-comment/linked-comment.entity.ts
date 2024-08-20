import { JsonValue } from '../common';
import { IssueComment } from '../issue-comment';

export class LinkedComment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  url: string;
  sourceId: string;
  sourceData: JsonValue | null;
  createdById: string | null;
  comment?: IssueComment;
  commentId: string;
}
