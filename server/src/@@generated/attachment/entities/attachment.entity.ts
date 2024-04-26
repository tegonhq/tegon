
import {Prisma,AttachmentStatus} from '@prisma/client'
import {User} from '../../user/entities/user.entity'
import {Workspace} from '../../workspace/entities/workspace.entity'


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
sourceMetadata: Prisma.JsonValue  | null;
uploadedBy?: User  | null;
uploadedById: string  | null;
workspace?: Workspace  | null;
workspaceId: string  | null;
}
