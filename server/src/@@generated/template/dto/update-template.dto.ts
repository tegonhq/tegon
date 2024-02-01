
import {Prisma} from '@prisma/client'




export class UpdateTemplateDto {
  deleted?: Date;
name?: string;
type?: string;
templateData?: Prisma.InputJsonValue;
}
