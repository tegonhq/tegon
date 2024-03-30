import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchInputData {
  @IsString()
  query: string;

  @IsString()
  workspaceId: string;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
