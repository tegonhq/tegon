import { IsEnum, IsNumber, IsString } from 'class-validator';

import { WorkflowCategoryEnum } from './workflow.entity';

export class CreateWorkflowDTO {
  @IsString()
  name: string;

  @IsNumber()
  position: number;

  @IsString()
  color: string;

  @IsEnum(WorkflowCategoryEnum)
  category: WorkflowCategoryEnum;
}
