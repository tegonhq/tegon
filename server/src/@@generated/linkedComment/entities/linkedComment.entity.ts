
import {Prisma} from '@prisma/client'
import {IssueComment} from '../../issueComment/entities/issueComment.entity'


export class LinkedComment {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
url: string ;
sourceId: string ;
source: Prisma.JsonValue  | null;
sourceData: Prisma.JsonValue  | null;
comment?: IssueComment ;
commentId: string ;
}
