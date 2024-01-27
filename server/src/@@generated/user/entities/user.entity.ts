
import {Role} from '@prisma/client'
import {Workspace} from '../../workspace/entities/workspace.entity'


export class User {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
email: string ;
password: string ;
fullname: string  | null;
username: string ;
role: Role ;
Workspace?: Workspace  | null;
workspaceId: string  | null;
}
