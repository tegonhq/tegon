
import {Prisma} from '@prisma/client'




export class UpdateUsersOnWorkspacesDto {
  teamIds?: string[];
externalAccountMappings?: Prisma.InputJsonValue;
}
