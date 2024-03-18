
import {Prisma} from '@prisma/client'




export class UpdateLinkedIssueDto {
  deleted?: Date;
url?: string;
sourceId?: string;
source?: Prisma.InputJsonValue;
sourceData?: Prisma.InputJsonValue;
}
