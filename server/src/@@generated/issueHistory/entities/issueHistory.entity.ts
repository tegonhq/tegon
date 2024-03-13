
import {Prisma} from '@prisma/client'
import {Issue} from '../../issue/entities/issue.entity'


export class IssueHistory {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
userId: string  | null;
issue?: Issue ;
issueId: string ;
sourceMetaData: Prisma.JsonValue  | null;
addedLabelIds: string[] ;
removedLabelIds: string[] ;
fromPriority: number  | null;
toPriority: number  | null;
fromStateId: string  | null;
toStateId: string  | null;
fromEstimate: number  | null;
toEstimate: number  | null;
fromAssigneeId: string  | null;
toAssigneeId: string  | null;
fromParentId: string  | null;
toParentId: string  | null;
relationChanges: Prisma.JsonValue[] ;
}
