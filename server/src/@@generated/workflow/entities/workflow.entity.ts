
import {Team} from '../../team/entities/team.entity'


export class Workflow {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
name: string ;
position: number ;
color: string ;
type: string ;
team?: Team  | null;
teamId: string  | null;
}
