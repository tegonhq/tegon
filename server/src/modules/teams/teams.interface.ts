/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { Preference, WorkflowCategory } from '@prisma/client';
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

export const workflowSeedData = [
  {
    name: 'Triage',
    category: WorkflowCategory.TRIAGE,
    color: '#F9703E',
    position: 0,
  },
  {
    name: 'Backlog',
    category: WorkflowCategory.BACKLOG,
    color: '#9CA3AF',
    position: 1,
  },
  {
    name: 'Todo',
    category: WorkflowCategory.UNSTARTED,
    color: '#9CA3AF',
    position: 2,
  },
  {
    name: 'In Progress',
    category: WorkflowCategory.STARTED,
    color: '#DE911D',
    position: 3,
  },
  {
    name: 'In Review',
    category: WorkflowCategory.STARTED,
    color: '#26A544',
    position: 4,
  },
  {
    name: 'Done',
    category: WorkflowCategory.COMPLETED,
    color: '#2563EB',
    position: 5,
  },
  {
    name: 'Duplicate',
    category: WorkflowCategory.CANCELED,
    color: '#9CA3AF',
    position: 6,
  },
  {
    name: 'Cancelled',
    category: WorkflowCategory.CANCELED,
    color: '#9CA3AF',
    position: 7,
  },
];
