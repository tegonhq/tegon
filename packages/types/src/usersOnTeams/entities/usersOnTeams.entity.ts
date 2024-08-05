
import {Status} from '@prisma/client'
import {User} from '../../user/entities/user.entity'
import {Team} from '../../team/entities/team.entity'


export class UsersOnTeams {
  createdAt: Date ;
updatedAt: Date ;
user?: User ;
team?: Team ;
userId: string ;
teamId: string ;
status: Status ;
}
