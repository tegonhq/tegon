
import {Prisma} from '@prisma/client'




export class UpdateLinkedIssuesDto {
  deleted?: Date;
title?: string;
url?: string;
source?: Prisma.InputJsonValue;
sourceData?: Prisma.InputJsonValue;
}
