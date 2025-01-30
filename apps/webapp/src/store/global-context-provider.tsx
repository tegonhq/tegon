import { types, type Instance } from 'mobx-state-tree';
import React from 'react';

import { ActionsStore } from './action';
import { ApplicationStore, defaultApplicationStoreValue } from './application';
import { CommentsStore } from './comments';
import { CommonStore, defaultCommonStoreValue } from './common';
import { CompanyStore } from './company';
import { ConversationHistoryStore } from './conversation-history';
import { ConversationsStore } from './conversations';
import { CyclesStore } from './cycle';
import { IntegrationAccountsStore } from './integration-accounts';
import { IssueHistoryStore } from './issue-history';
import { IssueRelationsStore } from './issue-relation';
import { IssueSuggestionsStore } from './issue-suggestions';
import { IssuesStore } from './issues';
import { LabelsStore } from './labels';
import { LinkedIssuesStore } from './linked-issues';
import { NotificationsStore } from './notifications';
import { PeopleStore } from './people';
import { ProjectMilestonesStore, ProjectsStore } from './projects';
import { SupportStore } from './support';
import { TeamsStore } from './teams';
import { TemplatesStore } from './templates';
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
  linkedIssuesStore: LinkedIssuesStore,
  issueRelationsStore: IssueRelationsStore,
  notificationsStore: NotificationsStore,
  viewsStore: ViewsStore,
  actionsStore: ActionsStore,
  issueSuggestionsStore: IssueSuggestionsStore,
  projectsStore: ProjectsStore,
  projectMilestonesStore: ProjectMilestonesStore,
  cyclesStore: CyclesStore,
  commonStore: CommonStore,
  conversationsStore: ConversationsStore,
  conversationHistoryStore: ConversationHistoryStore,
  templatesStore: TemplatesStore,
  companiesStore: CompanyStore,
  peopleStore: PeopleStore,
  supportStore: SupportStore,
});

export const storeContextStore = StoreContextModel.create({
  commentsStore: {
    comments: {},
  },
  issuesHistoryStore: {
    issueHistories: {},
  },
  issuesStore: {
    teamId: undefined,
  },
  workflowsStore: {
    workflows: {},
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
    silentFilters: {},
    identifier: '',
    displaySettings: defaultApplicationStoreValue.displaySettings,
    sidebarCollapsed: false,
  },
  integrationAccountsStore: {
    integrationAccounts: [],
    workspaceId: undefined,
  },
  linkedIssuesStore: {
    linkedIssues: {},
  },
  issueRelationsStore: {
    issueRelations: {},
  },
  notificationsStore: {
    notifications: [],
  },
  viewsStore: {
    views: [],
  },
  issueSuggestionsStore: {
    teamId: undefined,
  },
  actionsStore: {
    workspaceId: undefined,
    actions: [],
  },
  projectsStore: {
    projects: [],
    workspaceId: undefined,
  },
  projectMilestonesStore: {
    milestones: [],
  },
  cyclesStore: {
    cycles: [],
  },
  conversationsStore: {
    conversations: [],
  },
  conversationHistoryStore: {
    conversationHistory: [],
  },
  commonStore: defaultCommonStoreValue,
  templatesStore: {
    templates: [],
  },
  companiesStore: {
    companies: {},
  },
  peopleStore: {
    people: {},
  },
  supportStore: {
    support: {},
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
