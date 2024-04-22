
import {Workspace} from '../../workspace/entities/workspace.entity'
import {Issue} from '../../issue/entities/issue.entity'
import {Label} from '../../label/entities/label.entity'
import {Template} from '../../template/entities/template.entity'
import {Workflow} from '../../workflow/entities/workflow.entity'
import {TeamPreference} from '../../teamPreference/entities/teamPreference.entity'
import {View} from '../../view/entities/view.entity'


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
issue?: Issue[] ;
label?: Label[] ;
template?: Template[] ;
workflow?: Workflow[] ;
teamPreference?: TeamPreference[] ;
View?: View[] ;
}
