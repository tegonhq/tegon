
import {Prisma} from '@prisma/client'




export class UpdateIssueSuggestionDto {
  deleted?: Date;
issueId?: string;
suggestedLabelIds?: string[];
suggestedAssigneeId?: string;
metadata?: Prisma.InputJsonValue;
}
