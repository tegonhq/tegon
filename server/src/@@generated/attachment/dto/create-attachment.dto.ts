
import {AttachmentStatus} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class CreateAttachmentDto {
  deleted?: Date;
fileName?: string;
originalName: string;
fileType: string;
fileExt: string;
size: number;
@ApiProperty({ enum: AttachmentStatus})
status: AttachmentStatus;
}
