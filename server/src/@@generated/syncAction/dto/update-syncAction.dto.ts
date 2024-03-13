
import {ModelName,ActionType} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class UpdateSyncActionDto {
  deleted?: Date;
@ApiProperty({ enum: ModelName})
modelName?: ModelName;
modelId?: string;
@ApiProperty({ enum: ActionType})
action?: ActionType;
sequenceId?: bigint;
}
