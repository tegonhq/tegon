import { User } from '../../user/entities/user.entity';
import { Team } from '../../team/entities/team.entity';

export enum InviteStatus {
  INVITED = 'INVITED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export class UsersOnTeams {
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  team?: Team;
  userId: string;
  teamId: string;
  status: InviteStatus;
}
