
import {Prisma} from '@prisma/client'




export class CreateLinkedIssuesDto {
  deleted?: Date;
title: string;
url: string;
source?: Prisma.InputJsonValue;
sourceData?: Prisma.InputJsonValue;
}
