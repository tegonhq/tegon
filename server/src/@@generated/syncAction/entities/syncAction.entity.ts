
import {Prisma,ActionType} from '@prisma/client'


export class SyncAction {
  id: bigint ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
modelName: string ;
modelId: string ;
action: ActionType ;
data: Prisma.JsonValue ;
}
