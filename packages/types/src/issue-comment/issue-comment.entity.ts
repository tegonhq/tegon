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
  sourceMetadata: any | null;
  reactions?: Reaction[];
  reactionsData: any[];
  issue?: Issue;
  issueId: string;
  parent?: IssueComment | null;
  parentId: string | null;
  attachments: string[];
  replies?: IssueComment[];
  linkedComment?: LinkedComment[];
}
