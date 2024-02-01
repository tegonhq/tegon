
import {Role} from '@prisma/client'
import {UsersOnWorkspaces} from '../../usersOnWorkspaces/entities/usersOnWorkspaces.entity'
import {Template} from '../../template/entities/template.entity'
import {Team} from '../../team/entities/team.entity'


export class User {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
email: string ;
fullname: string  | null;
username: string ;
role: Role ;
initialSetupComplete: boolean ;
anonymousDataCollection: boolean ;
UsersOnWorkspaces?: UsersOnWorkspaces[] ;
template?: Template[] ;
team?: Team[] ;
}
