import { JsonValue } from '../common';
import { Issue } from '../issue';
import { LinkedComment } from '../linkedComment';
import { Reaction } from '../reaction';

export class IssueComment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  body: string;
  userId: string | null;
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
