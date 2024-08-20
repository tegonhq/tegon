import { IsOptional, IsString } from 'class-validator';

export class CreateLinkedIssueCommentDto {
  @IsString()
  url: string;

  @IsString()
  sourceId: string;

  @IsString()
  commentId: string;

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sourceData: any;
}
