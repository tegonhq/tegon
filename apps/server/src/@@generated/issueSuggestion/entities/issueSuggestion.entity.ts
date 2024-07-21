
import {Prisma} from '@prisma/client'
import {Issue} from '../../issue/entities/issue.entity'


export class IssueSuggestion {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
issueId: string ;
suggestedLabelIds: string[] ;
suggestedAssigneeId: string  | null;
metadata: Prisma.JsonValue  | null;
issue?: Issue  | null;
}
