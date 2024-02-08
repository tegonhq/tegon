
import {ActionType} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class CreateSyncActionDto {
  deleted?: Date;
modelName: string;
modelId: string;
@ApiProperty({ enum: ActionType})
action: ActionType;
sequenceId: number;
}
