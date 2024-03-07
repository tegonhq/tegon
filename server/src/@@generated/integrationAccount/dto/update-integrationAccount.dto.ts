
import {Prisma} from '@prisma/client'




export class UpdateIntegrationAccountDto {
  deleted?: Date;
integrationConfiguration?: Prisma.InputJsonValue;
installationId?: string;
settings?: Prisma.InputJsonValue;
}
