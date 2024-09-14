import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { WorkflowCategoryEnum } from './workflow.entity';

export class UpdateWorkflowDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  position?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsEnum(WorkflowCategoryEnum)
  category?: WorkflowCategoryEnum;
}
