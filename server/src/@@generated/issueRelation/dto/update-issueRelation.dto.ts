
import {IssueRelationType} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class UpdateIssueRelationDto {
  relatedIssueId?: string;
@ApiProperty({ enum: IssueRelationType})
type?: IssueRelationType;
createdById?: string;
deletedById?: string;
deleted?: Date;
}
