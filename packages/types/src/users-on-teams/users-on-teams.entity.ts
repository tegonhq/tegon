import { InviteStatus } from '../invite';
import { Team } from '../team';
import { User } from '../user';

export class UsersOnTeams {
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  team?: Team;
  userId: string;
  teamId: string;
  status: InviteStatus;
}
