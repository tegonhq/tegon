/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { IsOptional, IsString } from 'class-validator';

export class CreateTeamInput {
  @IsString()
  name: string;

  @IsString()
  identifier: string;

  @IsOptional()
  @IsString()
  icon?: string;
}

export class UpdateTeamInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  identifier?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}

export class TeamRequestIdBody {
  @IsString()
  teamId: string;
}

export class WorkspaceRequestIdBody {
  @IsString()
  workspaceId: string;
}
