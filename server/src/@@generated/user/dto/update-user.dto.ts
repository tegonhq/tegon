
import {Role} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class UpdateUserDto {
  email?: string;
fullname?: string;
username?: string;
@ApiProperty({ enum: Role})
role?: Role;
}
