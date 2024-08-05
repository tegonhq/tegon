import { Team } from '../team';
import { Workspace } from '../workspace';

export class Label {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  name: string;
  color: string;
  description: string | null;
  workspace?: Workspace;
  workspaceId: string;
  team?: Team | null;
  teamId: string | null;
  group?: Label | null;
  groupId: string | null;
  labels?: Label[];
}
