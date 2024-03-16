/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { types, type Instance } from 'mobx-state-tree';
import React from 'react';

import { ApplicationStore } from './application';
import { CommentsStore } from './comments';
import { IssueHistoryStore } from './issue-history';
import { IssuesStore } from './issues';
import { LabelsStore } from './labels';
import { TeamsStore } from './teams';
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
});

export const storeContextStore = StoreContextModel.create({
  commentsStore: {
    comments: [],
  },
  issuesHistoryStore: {
    issueHistory: [],
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
    filters: JSON.stringify({}),
    identifier: '',
  },
});

export type StoreContextInstance = Instance<typeof StoreContextModel>;
export const StoreContext = React.createContext<null | StoreContextInstance>(
  null,
);

export function useContextStore() {
  const store = React.useContext(StoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
}
