/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { Preference } from '@prisma/client';
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

export class CreatePreferenceInput {
  @IsString()
  preference: Preference;

  @IsString()
  value: IssueEstimateValues | Priorities;
}

enum IssueEstimateValues {
  EXPONENTIAL,
  FIBONACCI,
  LINEAR,
  T_SHIRT,
}

enum Priorities {
  NO_PRIORITY_FIRST,
  NO_PRIORITY_LAST,
}
