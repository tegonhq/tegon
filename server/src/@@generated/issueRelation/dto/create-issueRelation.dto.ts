
import {IssueRelationType} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class CreateIssueRelationDto {
  relatedIssueId: string;
@ApiProperty({ enum: IssueRelationType})
type: IssueRelationType;
createdById: string;
deletedById?: string;
deletedAt?: Date;
}
