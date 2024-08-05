'use client';

import type { IntegrationAccountType } from 'common/types';
import type { IntegrationDefinitionType } from 'common/types';
import type {
  IssueType,
  IssueHistoryType,
  IssueCommentType,
  IssueSuggestionType,
} from 'common/types';
import type { IssueRelationType } from 'common/types';
import type { LabelType } from 'common/types';
import type { LinkedIssueType } from 'common/types';
import type { NotificationType } from 'common/types';
import type { TeamType, WorkflowType } from 'common/types';
import type { ViewType } from 'common/types';
import type { UsersOnWorkspaceType, WorkspaceType } from 'common/types';

import Dexie from 'dexie';

import { MODELS } from './models';

export class TegonDatabase extends Dexie {
  workspaces: Dexie.Table<WorkspaceType, string>;
  labels: Dexie.Table<LabelType, string>;
  teams: Dexie.Table<TeamType, string>;
  workflows: Dexie.Table<WorkflowType, string>;
  issues: Dexie.Table<IssueType, string>;
  issueHistory: Dexie.Table<IssueHistoryType, string>;
  comments: Dexie.Table<IssueCommentType, string>;
  usersOnWorkspaces: Dexie.Table<UsersOnWorkspaceType, string>;
  integrationDefinitions: Dexie.Table<IntegrationDefinitionType, string>;
  integrationAccounts: Dexie.Table<IntegrationAccountType, string>;
  linkedIssues: Dexie.Table<LinkedIssueType, string>;
  issueRelations: Dexie.Table<IssueRelationType, string>;
  notifications: Dexie.Table<NotificationType, string>;
  views: Dexie.Table<ViewType, string>;
  issueSuggestions: Dexie.Table<IssueSuggestionType, string>;

  constructor() {
    super('TegonDatabase');

    this.version(8).stores({
      [MODELS.Workspace]: 'id,createdAt,updatedAt,name,slug',
      [MODELS.Label]:
        'id,createdAt,updatedAt,name,color,description,workspaceId,groupId,teamId',
      [MODELS.Team]: 'id,createdAt,updatedAt,name,identifier,workspaceId',
      [MODELS.Workflow]:
        'id,createdAt,updatedAt,name,position,color,category,teamId',
      [MODELS.Issue]:
        'id,createdAt,updatedAt,title,number,description,priority,dueDate,sortOrder,estimate,teamId,createdById,assigneeId,labelIds,parentId,stateId,sourceMetadata',
      [MODELS.UsersOnWorkspaces]:
        'id,createdAt,updatedAt,userId,workspaceId,teamIds',
      [MODELS.IssueHistory]:
        'id,createdAt,updatedAt,userId,issueId,assedLabelIds,removedLabelIds,fromPriority,toPriority,fromStateId,toStateId,fromEstimate,toEstimate,fromAssigneeId,toAssigneeId,fromParentId,toParentId,sourceMetadata',
      [MODELS.IssueComment]:
        'id,createdAt,updatedAt,userId,issueId,body,parentId,sourceMetadata',
      [MODELS.IntegrationDefinition]:
        'id,createdAt,updatedAt,userId,name,icon,spec,scopes,workspaceId',
      [MODELS.IntegrationAccount]:
        'id,createdAt,updatedAt,accountId,settings,integratedById,integrationDefinitionId,workspaceId',
      [MODELS.LinkedIssue]:
        'id,createdAt,updatedAt,url,sourceId,source,sourceData,issueId,createdById',
      [MODELS.IssueRelation]:
        'id,createdAt,updatedAt,issueId,createdById,type,relatedIssueId',
      [MODELS.Notification]:
        'id,createdAt,updatedAt,issueId,createdById,type,userId,actionData,sourceMetadata,readAt,workspaceId',
      [MODELS.View]:
        'id,createdAt,updatedAt,workspaceId,name,description,filters,isBookmarked,teamId',
      [MODELS.IssueSuggestion]:
        'id,createdAt,updatedAt,issueId,suggestedLabelIds,suggestedAssigneeId',
    });

    this.workspaces = this.table(MODELS.Workspace);
    this.labels = this.table(MODELS.Label);
    this.teams = this.table(MODELS.Team);
    this.workflows = this.table(MODELS.Workflow);
    this.issues = this.table(MODELS.Issue);
    this.usersOnWorkspaces = this.table(MODELS.UsersOnWorkspaces);
    this.issueHistory = this.table(MODELS.IssueHistory);
    this.comments = this.table(MODELS.IssueComment);
    this.integrationDefinitions = this.table(MODELS.IntegrationDefinition);
    this.integrationAccounts = this.table(MODELS.IntegrationAccount);
    this.linkedIssues = this.table(MODELS.LinkedIssue);
    this.issueRelations = this.table(MODELS.IssueRelation);
    this.notifications = this.table(MODELS.Notification);
    this.views = this.table(MODELS.View);
    this.issueSuggestions = this.table(MODELS.IssueSuggestion);
  }
}

export const tegonDatabase = new TegonDatabase();
