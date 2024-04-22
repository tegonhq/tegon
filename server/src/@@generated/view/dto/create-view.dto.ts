
import {Prisma} from '@prisma/client'




export class CreateViewDto {
  deleted?: Date;
name: string;
description: string;
filters: Prisma.InputJsonValue;
createdById: string;
}
