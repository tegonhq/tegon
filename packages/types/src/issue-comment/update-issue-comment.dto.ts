import { IsOptional, IsString } from 'class-validator';

export class UpdateIssueCommentDto {
  @IsString()
  @IsOptional()
  body?: string;

  @IsString()
  @IsOptional()
  bodyMarkdown?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  linkCommentMetadata?: any;

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sourceMetadata?: any;
}
