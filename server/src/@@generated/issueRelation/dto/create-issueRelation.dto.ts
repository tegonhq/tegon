
import {Prisma,IssueRelationType} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class CreateIssueRelationDto {
  relatedIssueId: string;
@ApiProperty({ enum: IssueRelationType})
type: IssueRelationType;
metadata?: Prisma.InputJsonValue;
createdById?: string;
deletedById?: string;
deleted?: Date;
}
