
import {Prisma} from '@prisma/client'




export class UpdateIssueCommentDto {
  deleted?: Date;
body?: string;
userId?: string;
sourceMetadata?: Prisma.InputJsonValue;
reactionsData?: Prisma.InputJsonValue[];
}
