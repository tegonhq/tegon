
import {WorkflowCategory} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class CreateWorkflowDto {
  deleted?: Date;
name: string;
position: number;
color: string;
@ApiProperty({ enum: WorkflowCategory})
category: WorkflowCategory;
}
