
import {Prisma} from '@prisma/client'
import {Workspace} from '../../workspace/entities/workspace.entity'
import {Team} from '../../team/entities/team.entity'


export class View {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
workspaceId: string ;
workspace?: Workspace ;
teamId: string  | null;
team?: Team  | null;
name: string ;
description: string ;
filters: Prisma.JsonValue ;
isFavorite: boolean ;
createdById: string ;
}
