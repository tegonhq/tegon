
import {Prisma} from '@prisma/client'




export class CreateIntegrationAccountDto {
  deleted?: Date;
integrationConfiguration: Prisma.InputJsonValue;
}
