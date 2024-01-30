
import {UsersOnWorkspaces} from '../../usersOnWorkspaces/entities/usersOnWorkspaces.entity'
import {Team} from '../../team/entities/team.entity'


export class Workspace {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
name: string ;
slug: string ;
UsersOnWorkspaces?: UsersOnWorkspaces[] ;
Team?: Team[] ;
}
