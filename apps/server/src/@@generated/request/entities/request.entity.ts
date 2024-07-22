
import {Workspace} from '../../workspace/entities/workspace.entity'


export class Request {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
modelName: string ;
data: string ;
response: string  | null;
llmModel: string ;
workspace?: Workspace ;
workspaceId: string ;
successful: boolean ;
}
