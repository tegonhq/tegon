import { JsonValue } from '../common';
import { Issue } from '../issue';
import { LinkedComment } from '../linked-comment';
import { Reaction } from '../reaction';

export class IssueComment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  body: string;
  bodyMarkdown?: string | null;
  userId: string | null;
  updatedById: string;
  sourceMetadata: JsonValue | null;
  reactions?: Reaction[];
  reactionsData: JsonValue[];
  issue?: Issue;
  issueId: string;
  parent?: IssueComment | null;
  parentId: string | null;
  attachments: string[];
  replies?: IssueComment[];
  linkedComment?: LinkedComment[];
}
