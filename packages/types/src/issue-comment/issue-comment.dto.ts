import { IsString } from 'class-validator';

export class IssueCommentRequestParamsDto {
  @IsString()
  issueCommentId: string;
}
