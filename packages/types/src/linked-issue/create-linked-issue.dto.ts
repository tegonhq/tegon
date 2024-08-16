import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateLinkedIssueDto {
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  sourceId: string;

  @IsOptional()
  @IsObject()
  source?: Record<string, string | number>;

  @IsOptional()
  @IsObject()
  sourceData?: Record<string, string | number>;
}
