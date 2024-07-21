
import {Preference} from '@prisma/client'
import {Team} from '../../team/entities/team.entity'


export class TeamPreference {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
team?: Team  | null;
teamId: string  | null;
preference: Preference ;
value: string ;
}
