import { Emoji } from '../emoji';
import { IssueComment } from '../issue-comment';

export class Reaction {
  id: string;
  reactedAt: Date;
  deleted: Date | null;
  userId: string;
  comment?: IssueComment;
  commentId: string;
  emoji?: Emoji;
  emojiId: string;
}
