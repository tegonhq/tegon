
import {UsersOnWorkspaces} from '../../usersOnWorkspaces/entities/usersOnWorkspaces.entity'
import {Template} from '../../template/entities/template.entity'
import {Issue} from '../../issue/entities/issue.entity'
import {IntegrationAccount} from '../../integrationAccount/entities/integrationAccount.entity'
import {Attachment} from '../../attachment/entities/attachment.entity'


export class User {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
email: string ;
fullname: string  | null;
username: string ;
initialSetupComplete: boolean ;
anonymousDataCollection: boolean ;
usersOnWorkspaces?: UsersOnWorkspaces[] ;
template?: Template[] ;
createdBy?: Issue[] ;
integrationAccount?: IntegrationAccount[] ;
attachment?: Attachment[] ;
}
