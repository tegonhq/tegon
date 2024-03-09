
import {Prisma} from '@prisma/client'
import {Reaction} from '../../reaction/entities/reaction.entity'
import {Issue} from '../../issue/entities/issue.entity'


export class IssueComment {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
body: string ;
userId: string ;
reactions?: Reaction[] ;
reactionsData: Prisma.JsonValue[] ;
issue?: Issue ;
issueId: string ;
parent?: IssueComment  | null;
parentId: string  | null;
sourceMetadata: Prisma.JsonValue  | null;
replies?: IssueComment[] ;
}
