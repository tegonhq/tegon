/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { types, type Instance } from 'mobx-state-tree';
import React from 'react';

import { ApplicationStore, defaultApplicationStoreValue } from './application';
import { CommentsStore } from './comments';
import { IntegrationAccountsStore } from './integration-accounts';
import { IntegrationDefinitionsStore } from './integration-definitions';
import { IssueHistoryStore } from './issue-history';
import { IssueRelationsStore } from './issue-relation';
import { IssuesStore } from './issues';
import { LabelsStore } from './labels';
import { LinkedIssuesStore } from './linked-issues';
import { NotificationsStore } from './notifications';
import { TeamsStore } from './teams';
import { ViewsStore } from './views';
import { WorkflowsStore } from './workflows';
import { WorkspaceStore } from './workspace';

const StoreContextModel = types.model({
  commentsStore: CommentsStore,
  issuesHistoryStore: IssueHistoryStore,
  issuesStore: IssuesStore,
  workflowsStore: WorkflowsStore,
  labelsStore: LabelsStore,
  teamsStore: TeamsStore,
  workspaceStore: WorkspaceStore,
  applicationStore: ApplicationStore,
  integrationAccountsStore: IntegrationAccountsStore,
  integrationDefinitionsStore: IntegrationDefinitionsStore,
  linkedIssuesStore: LinkedIssuesStore,
  issueRelationsStore: IssueRelationsStore,
  notificationsStore: NotificationsStore,
  viewsStore: ViewsStore,
});

export const storeContextStore = StoreContextModel.create({
  commentsStore: {
    comments: [],
  },
  issuesHistoryStore: {
    issueHistories: [],
  },
  issuesStore: {
    issues: [],
    teamId: undefined,
  },
  workflowsStore: {
    workflows: [],
    teamId: undefined,
  },
  labelsStore: {
    labels: [],
    workspaceId: undefined,
  },
  teamsStore: {
    teams: [],
    workspaceId: undefined,
  },
  workspaceStore: {
    workspace: undefined,
    usersOnWorkspaces: [],
  },
  applicationStore: {
    filters: {},
    identifier: '',
    displaySettings: defaultApplicationStoreValue.displaySettings,
    sidebarCollapsed: false,
  },
  integrationDefinitionsStore: {
    integrationDefinitions: [],
    workspaceId: undefined,
  },
  integrationAccountsStore: {
    integrationAccounts: [],
    workspaceId: undefined,
  },
  linkedIssuesStore: {
    linkedIssues: [],
    issueId: undefined,
  },
  issueRelationsStore: {
    issueRelations: [],
    issueId: undefined,
  },
  notificationsStore: {
    notifications: [],
  },
  viewsStore: {
    views: [],
  },
});

export type StoreContextInstanceType = Instance<typeof StoreContextModel>;
export const StoreContext =
  React.createContext<null | StoreContextInstanceType>(null);

export function useContextStore(): StoreContextInstanceType {
  const store = React.useContext(StoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
}
