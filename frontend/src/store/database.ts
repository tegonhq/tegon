/** Copyright (c) 2024, Tegon, all rights reserved. **/

'use client';

import Dexie from 'dexie';

import type { IssueType, IssueHistoryType } from 'common/types/issue';
import type { LabelType } from 'common/types/label';
import type { TeamType, WorkflowType } from 'common/types/team';
import type {
  UsersOnWorkspaceType,
  WorkspaceType,
} from 'common/types/workspace';

import { MODELS } from './models';

export class TegonDatabase extends Dexie {
  workspaces: Dexie.Table<WorkspaceType, string>;
  labels: Dexie.Table<LabelType, string>;
  teams: Dexie.Table<TeamType, string>;
  workflows: Dexie.Table<WorkflowType, string>;
  issues: Dexie.Table<IssueType, string>;
  issueHistory: Dexie.Table<IssueHistoryType, string>;
  usersOnWorkspaces: Dexie.Table<UsersOnWorkspaceType, string>;

  constructor() {
    super('TegonDatabase');

    this.version(1).stores({
      [MODELS.Workspace]: 'id,createdAt,updatedAt,name,slug',
      [MODELS.Label]:
        'id,createdAt,updatedAt,name,color,description,workspaceId,groupId,teamId',
      [MODELS.Team]: 'id,createdAt,updatedAt,name,identifier,workspaceId',
      [MODELS.Workflow]:
        'id,createdAt,updatedAt,name,position,color,category,teamId',
      [MODELS.Issue]:
        'id,createdAt,updatedAt,title,number,description,priority,dueDate,sortOrder,estimate,teamId,createdById,assigneeId,labelIds,parentId,stateId',
      [MODELS.UsersOnWorkspaces]:
        'id,createdAt,updatedAt,userId,workspaceId,teamIds',
      [MODELS.IssueHistory]:
        'id,createdAt,updatedAt,userId,issueId,assedLabelIds,removedLabelIds,fromPriority,toPriority,fromStateId,toStateId,fromEstimate,toEstimate,fromAssigneeId,toAssigneeId,fromParentId,toParentId',
    });

    this.workspaces = this.table(MODELS.Workspace);
    this.labels = this.table(MODELS.Label);
    this.teams = this.table(MODELS.Team);
    this.workflows = this.table(MODELS.Workflow);
    this.issues = this.table(MODELS.Issue);
    this.usersOnWorkspaces = this.table(MODELS.UsersOnWorkspaces);
    this.issueHistory = this.table(MODELS.IssueHistory);
  }
}

export const tegonDatabase = new TegonDatabase();
