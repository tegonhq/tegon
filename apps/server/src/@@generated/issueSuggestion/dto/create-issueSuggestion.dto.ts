
import {Prisma} from '@prisma/client'




export class CreateIssueSuggestionDto {
  deleted?: Date;
issueId: string;
suggestedLabelIds: string[];
suggestedAssigneeId?: string;
metadata?: Prisma.InputJsonValue;
}
