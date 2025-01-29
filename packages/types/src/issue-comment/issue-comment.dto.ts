import { IsString } from 'class-validator';

export class IssueCommentRequestParamsDto {
  @IsString()
  issueCommentId: string;
}

export class IssueCommentDto {
  issueCommentId: string;
}
