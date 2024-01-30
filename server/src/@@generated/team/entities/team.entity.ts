
import {Workspace} from '../../workspace/entities/workspace.entity'


export class Team {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
name: string ;
identifier: string ;
workspace?: Workspace ;
workspaceId: string ;
}
