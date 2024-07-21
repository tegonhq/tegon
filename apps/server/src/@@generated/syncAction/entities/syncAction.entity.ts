
import {ModelName,ActionType} from '@prisma/client'
import {Workspace} from '../../workspace/entities/workspace.entity'


export class SyncAction {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
modelName: ModelName ;
modelId: string ;
action: ActionType ;
sequenceId: bigint ;
workspace?: Workspace ;
workspaceId: string ;
}
