
import {Prisma} from '@prisma/client'
import {User} from '../../user/entities/user.entity'
import {IntegrationDefinition} from '../../integrationDefinition/entities/integrationDefinition.entity'
import {Workspace} from '../../workspace/entities/workspace.entity'


export class IntegrationAccount {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
integrationConfiguration: Prisma.JsonValue ;
accountId: string  | null;
settings: Prisma.JsonValue  | null;
integratedBy?: User ;
integratedById: string ;
integrationDefinition?: IntegrationDefinition ;
integrationDefinitionId: string ;
workspace?: Workspace ;
workspaceId: string ;
}
