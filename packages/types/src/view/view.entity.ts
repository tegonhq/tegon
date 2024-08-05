import { JsonValue } from '../common';
import { Team } from '../team';
import { Workspace } from '../workspace';

export class View {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  workspaceId: string;
  workspace?: Workspace;
  teamId: string | null;
  team?: Team | null;
  name: string;
  description: string;
  filters: JsonValue;
  isBookmarked: boolean;
  createdById: string;
}
