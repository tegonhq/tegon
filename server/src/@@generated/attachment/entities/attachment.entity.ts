
import {AttachmentStatus} from '@prisma/client'
import {User} from '../../user/entities/user.entity'
import {Team} from '../../team/entities/team.entity'


export class Attachment {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
fileName: string  | null;
originalName: string ;
fileType: string ;
fileExt: string ;
size: number ;
status: AttachmentStatus ;
uploadedBy?: User ;
uploadedById: string ;
team?: Team  | null;
teamId: string  | null;
}
