/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { IsString } from 'class-validator';

export class CreateWorkspaceInput {
  @IsString()
  name: string;

  @IsString()
  slug: string;
}

export class UpdateWorkspaceInput {
  @IsString()
  name?: string;

  @IsString()
  slug?: string;
}

export class WorkspaceRequestIdBody {
  @IsString()
  workspaceId: string;
}
