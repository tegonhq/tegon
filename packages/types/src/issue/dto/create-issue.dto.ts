
import {Prisma} from '@prisma/client'




export class CreateIssueDto {
  deleted?: Date;
title: string;
number: number;
description?: string;
priority?: number;
dueDate?: Date;
sortOrder?: number;
subIssueSortOrder?: number;
estimate?: number;
sourceMetadata?: Prisma.InputJsonValue;
isBidirectional?: boolean;
subscriberIds: string[];
assigneeId?: string;
labelIds: string[];
stateId: string;
attachments: string[];
}
