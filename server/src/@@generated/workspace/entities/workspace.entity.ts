
import {User} from '../../user/entities/user.entity'


export class Workspace {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
name: string ;
users?: User[] ;
}
