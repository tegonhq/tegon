
import {Prisma,IssueRelationType} from '@prisma/client'
import {Issue} from '../../issue/entities/issue.entity'


export class IssueRelation {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
issue?: Issue ;
issueId: string ;
relatedIssueId: string ;
type: IssueRelationType ;
metadata: Prisma.JsonValue  | null;
createdById: string  | null;
deletedById: string  | null;
deleted: Date  | null;
}
