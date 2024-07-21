
import {Preference} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'




export class UpdateTeamPreferenceDto {
  deleted?: Date;
@ApiProperty({ enum: Preference})
preference?: Preference;
value?: string;
}
