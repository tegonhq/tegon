
import {UsersOnWorkspaces} from '../../usersOnWorkspaces/entities/usersOnWorkspaces.entity'
import {Team} from '../../team/entities/team.entity'
import {Label} from '../../label/entities/label.entity'
import {Template} from '../../template/entities/template.entity'
import {SyncAction} from '../../syncAction/entities/syncAction.entity'
import {IntegrationAccount} from '../../integrationAccount/entities/integrationAccount.entity'
import {IntegrationDefinition} from '../../integrationDefinition/entities/integrationDefinition.entity'
import {Attachment} from '../../attachment/entities/attachment.entity'
import {View} from '../../view/entities/view.entity'
import {AIRequest} from '../../aIRequest/entities/aIRequest.entity'
import {Prompt} from '../../prompt/entities/prompt.entity'


export class Workspace {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
name: string ;
slug: string ;
icon: string  | null;
usersOnWorkspaces?: UsersOnWorkspaces[] ;
team?: Team[] ;
label?: Label[] ;
template?: Template[] ;
syncAction?: SyncAction[] ;
integrationAccount?: IntegrationAccount[] ;
integrationDefinition?: IntegrationDefinition[] ;
attachments?: Attachment[] ;
View?: View[] ;
aiRequests?: AIRequest[] ;
prompts?: Prompt[] ;
}
