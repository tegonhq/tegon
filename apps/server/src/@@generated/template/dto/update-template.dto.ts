
import {Prisma,TemplateCategory} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class UpdateTemplateDto {
  deleted?: Date;
name?: string;
@ApiProperty({ enum: TemplateCategory})
category?: TemplateCategory;
templateData?: Prisma.InputJsonValue;
}
