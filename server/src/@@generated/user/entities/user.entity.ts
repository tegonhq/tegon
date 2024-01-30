
import {Role} from '@prisma/client'
import {UsersOnWorkspaces} from '../../usersOnWorkspaces/entities/usersOnWorkspaces.entity'


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
}
