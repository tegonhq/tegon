
import {Workspace} from '../../workspace/entities/workspace.entity'
import {Team} from '../../team/entities/team.entity'


export class Label {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
name: string ;
color: string ;
description: string  | null;
workspace?: Workspace ;
workspaceId: string ;
team?: Team  | null;
teamId: string  | null;
group?: Label  | null;
groupId: string  | null;
labels?: Label[] ;
}
