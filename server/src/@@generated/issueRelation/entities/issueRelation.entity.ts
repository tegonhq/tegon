
import {IssueRelationType} from '@prisma/client'
import {Issue} from '../../issue/entities/issue.entity'


export class IssueRelation {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
issue?: Issue ;
issueId: string ;
relatedIssueId: string ;
type: IssueRelationType ;
createdById: string ;
deletedById: string  | null;
deletedAt: Date  | null;
}
