
import {WorkflowCategory} from '@prisma/client'
import {Team} from '../../team/entities/team.entity'


export class Workflow {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
deleted: Date  | null;
name: string ;
position: number ;
color: string ;
category: WorkflowCategory ;
team?: Team  | null;
teamId: string  | null;
}
