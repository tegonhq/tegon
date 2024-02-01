
import {Status} from '@prisma/client'
import {User} from '../../user/entities/user.entity'
import {Workspace} from '../../workspace/entities/workspace.entity'


export class UsersOnWorkspaces {
  createdAt: Date ;
updatedAt: Date ;
user?: User ;
workspace?: Workspace ;
userId: string ;
workspaceId: string ;
status: Status ;
}
