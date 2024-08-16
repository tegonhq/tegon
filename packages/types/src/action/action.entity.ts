import { ActionEntity } from '../action-entity';
import { Workspace } from '../workspace';

export class Action {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  name: string;
  integrations: string[];

  workspace?: Workspace;
  workspaceId: string;
  actionEntity?: ActionEntity[];
}
