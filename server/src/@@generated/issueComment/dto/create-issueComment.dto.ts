
import {Prisma} from '@prisma/client'




export class CreateIssueCommentDto {
  deleted?: Date;
body: string;
userId?: string;
sourceMetadata?: Prisma.InputJsonValue;
reactionsData: Prisma.InputJsonValue[];
}
