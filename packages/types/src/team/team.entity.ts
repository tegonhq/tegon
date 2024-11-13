import { Issue } from '../issue';
import { Label } from '../label';
import { Template } from '../template';
import { View } from '../view';
import { Workflow } from '../workflow';
import { Workspace } from '../workspace';

export class Team {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  name: string;
  identifier: string;
  icon: string | null;
  workspace?: Workspace;
  workspaceId: string;
  issue?: Issue[];
  label?: Label[];
  template?: Template[];
  workflow?: Workflow[];
  View?: View[];
}
