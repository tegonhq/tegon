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

export class TeamRequestParams {
  @IsString()
  teamId: string;
}

export class WorkspaceRequestParams {
  @IsString()
  workspaceId: string;
}

export class PreferenceInput {
  @IsString()
  preference: Preference;

  @IsString()
  value: IssueEstimateValues | Priorities;
}

export class TeamMemberInput {
  @IsString()
  userId: string;
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
