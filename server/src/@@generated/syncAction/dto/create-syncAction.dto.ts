
import {Prisma,ActionType} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class CreateSyncActionDto {
  id: bigint;
deleted?: Date;
modelName: string;
modelId: string;
@ApiProperty({ enum: ActionType})
action: ActionType;
data: Prisma.InputJsonValue;
}
