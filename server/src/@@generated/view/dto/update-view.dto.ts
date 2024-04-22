
import {Prisma} from '@prisma/client'




export class UpdateViewDto {
  deleted?: Date;
name?: string;
description?: string;
filters?: Prisma.InputJsonValue;
createdById?: string;
}
