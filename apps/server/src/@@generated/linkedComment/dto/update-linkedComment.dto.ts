
import {Prisma} from '@prisma/client'




export class UpdateLinkedCommentDto {
  deleted?: Date;
url?: string;
sourceId?: string;
source?: Prisma.InputJsonValue;
sourceData?: Prisma.InputJsonValue;
createdById?: string;
}
