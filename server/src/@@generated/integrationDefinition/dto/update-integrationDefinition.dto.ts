
import {Prisma} from '@prisma/client'




export class UpdateIntegrationDefinitionDto {
  deleted?: Date;
name?: string;
icon?: string;
spec?: Prisma.InputJsonValue;
clientId?: string;
clientSecret?: string;
scopes?: string;
}
