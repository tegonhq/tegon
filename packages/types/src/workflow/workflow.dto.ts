import { IsOptional, IsString } from 'class-validator';

export class WorkflowRequestParamsDto {
  @IsString()
  teamId: string;

  @IsString()
  @IsOptional()
  workflowId?: string;
}
