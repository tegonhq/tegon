
import {Prisma,TemplateCategory} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class CreateTemplateDto {
  deleted?: Date;
name: string;
@ApiProperty({ enum: TemplateCategory})
category: TemplateCategory;
templateData: Prisma.InputJsonValue;
}
