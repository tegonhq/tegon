
import {Prisma} from '@prisma/client'
import {Issue} from '../../issue/entities/issue.entity'


export class LinkedIssue {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
url: string ;
sourceId: string  | null;
source: Prisma.JsonValue  | null;
sourceData: Prisma.JsonValue  | null;
createdById: string  | null;
issue?: Issue ;
issueId: string ;
}
