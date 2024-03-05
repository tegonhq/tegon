
import {ActionType} from '@prisma/client'
import {Workspace} from '../../workspace/entities/workspace.entity'


export class SyncAction {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
modelName: string ;
modelId: string ;
action: ActionType ;
sequenceId: number ;
workspace?: Workspace ;
workspaceId: string ;
}
