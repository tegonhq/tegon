
import {Workspace} from '../../workspace/entities/workspace.entity'
import {User} from '../../user/entities/user.entity'
import {Label} from '../../label/entities/label.entity'
import {Template} from '../../template/entities/template.entity'
import {Workflow} from '../../workflow/entities/workflow.entity'


export class Team {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
name: string ;
identifier: string ;
icon: string  | null;
workspace?: Workspace ;
workspaceId: string ;
user?: User ;
userId: string ;
Label?: Label[] ;
Template?: Template[] ;
Workflow?: Workflow[] ;
}
