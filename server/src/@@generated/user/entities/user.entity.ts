
import {Role} from '@prisma/client'
import {UsersOnWorkspaces} from '../../usersOnWorkspaces/entities/usersOnWorkspaces.entity'
import {Template} from '../../template/entities/template.entity'
import {Team} from '../../team/entities/team.entity'
import {Issue} from '../../issue/entities/issue.entity'


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
usersOnWorkspaces?: UsersOnWorkspaces[] ;
template?: Template[] ;
team?: Team[] ;
createdBy?: Issue[] ;
}
