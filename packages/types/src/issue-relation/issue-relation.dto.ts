import { IsString } from 'class-validator';

export class IssueRelationIdRequestDto {
  @IsString()
  issueRelationId: string;
}
