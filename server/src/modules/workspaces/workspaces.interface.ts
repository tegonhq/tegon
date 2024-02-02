/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceInput {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  icon: string;
}

export class UpdateWorkspaceInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  icon: string;
}

export class WorkspaceRequestIdBody {
  @IsString()
  workspaceId: string;
}
