
import {Prisma} from '@prisma/client'




export class CreateUsersOnWorkspacesDto {
  teamIds: string[];
externalAccountMappings?: Prisma.InputJsonValue;
}
