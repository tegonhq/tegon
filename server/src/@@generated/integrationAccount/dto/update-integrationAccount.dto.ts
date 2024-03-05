
import {Prisma} from '@prisma/client'




export class UpdateIntegrationAccountDto {
  deleted?: Date;
integrationConfiguration?: Prisma.InputJsonValue;
}
