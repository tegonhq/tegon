
import {Prisma} from '@prisma/client'
import {Reaction} from '../../reaction/entities/reaction.entity'
import {Issue} from '../../issue/entities/issue.entity'
import {LinkedComment} from '../../linkedComment/entities/linkedComment.entity'


export class IssueComment {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
body: string ;
userId: string  | null;
sourceMetadata: Prisma.JsonValue  | null;
reactions?: Reaction[] ;
reactionsData: Prisma.JsonValue[] ;
issue?: Issue ;
issueId: string ;
parent?: IssueComment  | null;
parentId: string  | null;
replies?: IssueComment[] ;
linkedComment?: LinkedComment[] ;
}
