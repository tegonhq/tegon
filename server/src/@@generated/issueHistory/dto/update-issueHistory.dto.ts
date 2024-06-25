
import {Prisma} from '@prisma/client'




export class UpdateIssueHistoryDto {
  deleted?: Date;
userId?: string;
sourceMetaData?: Prisma.InputJsonValue;
addedLabelIds?: string[];
removedLabelIds?: string[];
fromPriority?: number;
toPriority?: number;
fromStateId?: string;
toStateId?: string;
fromEstimate?: number;
toEstimate?: number;
fromAssigneeId?: string;
toAssigneeId?: string;
fromParentId?: string;
toParentId?: string;
fromTeamId?: string;
toTeamId?: string;
relationChanges?: Prisma.InputJsonValue;
}
