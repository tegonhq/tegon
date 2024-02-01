
import {UsersOnWorkspaces} from '../../usersOnWorkspaces/entities/usersOnWorkspaces.entity'
import {Team} from '../../team/entities/team.entity'
import {Label} from '../../label/entities/label.entity'
import {Template} from '../../template/entities/template.entity'


export class Workspace {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
name: string ;
slug: string ;
icon: string  | null;
UsersOnWorkspaces?: UsersOnWorkspaces[] ;
Team?: Team[] ;
Label?: Label[] ;
Template?: Template[] ;
}
