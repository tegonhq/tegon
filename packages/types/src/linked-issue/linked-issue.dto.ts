import { IsString } from 'class-validator';

export class LinkedIssueRequestParamsDto {
  @IsString()
  linkedIssueId: string;
}

export class LinkIssueInput {
  @IsString()
  url: string;

  type?: string;
  title?: string;
}
