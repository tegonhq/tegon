
import {Prisma,IntegrationName} from '@prisma/client'
import {Workspace} from '../../workspace/entities/workspace.entity'
import {IntegrationAccount} from '../../integrationAccount/entities/integrationAccount.entity'


export class IntegrationDefinition {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
name: IntegrationName ;
icon: string ;
spec: Prisma.JsonValue ;
clientId: string ;
clientSecret: string ;
scopes: string ;
workspace?: Workspace ;
workspaceId: string ;
IntegrationAccount?: IntegrationAccount[] ;
}
