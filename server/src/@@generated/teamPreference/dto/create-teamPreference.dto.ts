
import {Preference} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class CreateTeamPreferenceDto {
  deleted?: Date;
@ApiProperty({ enum: Preference})
preference: Preference;
value: string;
}
