import { IsJSON, IsOptional, IsString } from 'class-validator';

export class CreateLinkedIssueDto {
  @IsString()
  url: string;

  @IsString()
  sourceId: string;

  @IsOptional()
  @IsJSON()
  source?: Record<string, string | number>;

  @IsOptional()
  @IsJSON()
  sourceData?: Record<string, string | number>;

  @IsOptional()
  @IsString()
  createdById?: string;
}
