
import {Prisma} from '@prisma/client'
import {User} from '../../user/entities/user.entity'
import {Workspace} from '../../workspace/entities/workspace.entity'
import {Team} from '../../team/entities/team.entity'


export class Template {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
name: string ;
type: string ;
templateData: Prisma.JsonValue ;
createdBy?: User ;
createdById: string ;
workspace?: Workspace ;
workspaceId: string ;
team?: Team  | null;
teamId: string  | null;
}
