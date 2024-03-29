import { IsString } from 'class-validator';

export class SearchInputData {
  @IsString()
  query: string;

  @IsString()
  workspaceId: string;
}
