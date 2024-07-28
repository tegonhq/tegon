
import {LLMModels} from '@prisma/client'
import {Workspace} from '../../workspace/entities/workspace.entity'


export class Prompt {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
name: string ;
prompt: string ;
model: LLMModels ;
workspace?: Workspace ;
workspaceId: string ;
}
