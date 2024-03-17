
import {Prisma} from '@prisma/client'




export class CreateLinkedIssueDto {
  deleted?: Date;
title: string;
url: string;
sourceId: string;
source?: Prisma.InputJsonValue;
sourceData?: Prisma.InputJsonValue;
}
