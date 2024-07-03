
import {InviteStatus,Role} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class UpdateInviteDto {
  deleted?: Date;
sentAt?: Date;
expiresAt?: Date;
emailId?: string;
fullName?: string;
workspaceId?: string;
@ApiProperty({ enum: InviteStatus})
status?: InviteStatus;
teamIds?: string[];
@ApiProperty({ enum: Role})
role?: Role;
}
