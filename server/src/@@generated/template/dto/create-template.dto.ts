
import {Prisma} from '@prisma/client'




export class CreateTemplateDto {
  deleted?: Date;
name: string;
type: string;
templateData: Prisma.InputJsonValue;
}
