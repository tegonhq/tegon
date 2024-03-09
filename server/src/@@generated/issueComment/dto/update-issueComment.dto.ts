
import {Prisma} from '@prisma/client'




export class UpdateIssueCommentDto {
  deleted?: Date;
body?: string;
userId?: string;
reactionsData?: Prisma.InputJsonValue[];
sourceMetadata?: Prisma.InputJsonValue;
}
