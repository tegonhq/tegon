/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsOptional, IsString } from 'class-validator';

export class SearchInputData {
  @IsString()
  query: string;

  @IsString()
  workspaceId: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
