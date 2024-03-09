
import {Prisma} from '@prisma/client'




export class CreateIssueCommentDto {
  deleted?: Date;
body: string;
userId: string;
reactionsData: Prisma.InputJsonValue[];
sourceMetadata?: Prisma.InputJsonValue;
}
