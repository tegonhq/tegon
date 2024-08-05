import { JsonValue } from '../common';
import { Team } from '../team';
import { User } from '../user/user.entity';
import { Workspace } from '../workspace/workspace.entity';

export enum TemplateCategoryEnum {
  ISSUE = 'ISSUE',
  PROJECT = 'PROJECT',
  DOCUMENT = 'DOCUMENT',
}

export const TemplateCategory = {
  ISSUE: 'ISSUE',
  PROJECT: 'PROJECT',
  DOCUMENT: 'DOCUMENT',
};

export type TemplateCategory =
  (typeof TemplateCategory)[keyof typeof TemplateCategory];

export class Template {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  name: string;
  category: TemplateCategory;
  templateData: JsonValue;
  createdBy?: User;
  createdById: string;
  workspace?: Workspace;
  workspaceId: string;
  team?: Team | null;
  teamId: string | null;
}
