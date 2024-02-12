
import {IssueComment} from '../../issueComment/entities/issueComment.entity'
import {Emoji} from '../../emoji/entities/emoji.entity'


export class Reaction {
  id: string ;
reactedAt: Date ;
deleted: Date  | null;
userId: string ;
comment?: IssueComment ;
commentId: string ;
emoji?: Emoji ;
emojiId: string ;
}
