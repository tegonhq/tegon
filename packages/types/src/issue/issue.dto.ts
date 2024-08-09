import { IsString } from 'class-validator';

export class IssueRequestParamsDto {
  @IsString()
  issueId: string;
}
