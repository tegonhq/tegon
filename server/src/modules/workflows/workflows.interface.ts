/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateWorkflowInput {
  @IsString()
  name: string;

  @IsInt()
  position: number;

  @IsString()
  color: string;

  @IsString()
  type: string;

  @IsString()
  teamId: string;
}

export class UpdateWorkflowInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  position?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  type?: string;
}

export class WorkflowRequestIdBody {
  @IsString()
  workflowId: string;
}

export class TeamRequestIdBody {
  @IsString()
  teamId: string;
}
