import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { WorkflowCategoryEnum } from './workflow.entity';

export class CreateWorkflowDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  position: number;

  @IsString()
  color: string;

  @IsEnum(WorkflowCategoryEnum)
  category: WorkflowCategoryEnum;
}
