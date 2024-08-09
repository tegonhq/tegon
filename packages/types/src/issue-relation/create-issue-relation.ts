import { IsEnum, IsString } from 'class-validator';

import { IssueRelationEnum } from '../issue-relation';

export class CreateIssueRelationDto {
  @IsEnum(IssueRelationEnum)
  type: IssueRelationEnum;

  @IsString()
  issueId: string;

  @IsString()
  relatedIssueId: string;
}
