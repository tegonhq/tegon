'use client';

import { Loader } from '@tegonhq/ui/components/loader';
import * as React from 'react';

import { hash } from 'common/common-utils';
import type { BootstrapResponse } from 'common/types';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useBootstrapRecords, useDeltaRecords } from 'services/sync';

import { tegonDatabase } from 'store/database';
import { useContextStore } from 'store/global-context-provider';
import { MODELS } from 'store/models';
import { UserContext } from 'store/user-context';

import { saveSocketData } from './socket-data-util';

interface Props {
  children: React.ReactElement;
}

export function BootstrapWrapper({ children }: Props) {
  const workspace = useCurrentWorkspace();
  const user = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const hashKey = `${workspace.id}__${user.id}`;
  const lastSequenceId =
    localStorage && localStorage.getItem(`lastSequenceId_${hash(hashKey)}`);

  const {
    commentsStore,
    issuesHistoryStore,
    issuesStore,
    workflowsStore,
    workspaceStore,
    teamsStore,
    labelsStore,
    integrationAccountsStore,
    linkedIssuesStore,
    issueRelationsStore,
    notificationsStore,
    viewsStore,
    issueSuggestionsStore,
    actionsStore,
    projectsStore,
    projectMilestonesStore,
    cyclesStore,
    conversationsStore,
    conversationHistoryStore,
  } = useContextStore();

  const MODEL_STORE_MAP = {
    [MODELS.Label]: labelsStore,
    [MODELS.Workspace]: workspaceStore,
    [MODELS.UsersOnWorkspaces]: workspaceStore,
    [MODELS.Team]: teamsStore,
    [MODELS.Workflow]: workflowsStore,
    [MODELS.Issue]: issuesStore,
    [MODELS.IssueHistory]: issuesHistoryStore,
    [MODELS.IssueComment]: commentsStore,
    [MODELS.IntegrationAccount]: integrationAccountsStore,
    [MODELS.LinkedIssue]: linkedIssuesStore,
    [MODELS.IssueRelation]: issueRelationsStore,
    [MODELS.Notification]: notificationsStore,
    [MODELS.View]: viewsStore,
    [MODELS.IssueSuggestion]: issueSuggestionsStore,
    [MODELS.Action]: actionsStore,
    [MODELS.Project]: projectsStore,
    [MODELS.ProjectMilestone]: projectMilestonesStore,
    [MODELS.Cycle]: cyclesStore,
    [MODELS.Conversation]: conversationsStore,
    [MODELS.ConversationHistory]: conversationHistoryStore,
  };

  React.useEffect(() => {
    if (workspace) {
      initStore();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { refetch: bootstrapRecords } = useBootstrapRecords({
    modelNames: Object.values(MODELS),
    workspaceId: workspace?.id,
    userId: user.id,
    onSuccess: async (data: BootstrapResponse) => {
      await saveSocketData(data.syncActions, MODEL_STORE_MAP);
      localStorage.setItem(
        `lastSequenceId_${hash(hashKey)}`,
        `${data.lastSequenceId}`,
      );
    },
  });

  const { refetch: syncRecords } = useDeltaRecords({
    modelNames: Object.values(MODELS),
    workspaceId: workspace?.id,
    lastSequenceId,
    userId: user.id,
    onSuccess: async (data: BootstrapResponse) => {
      await saveSocketData(data.syncActions, MODEL_STORE_MAP);
      localStorage.setItem(
        `lastSequenceId_${hash(hashKey)}`,
        `${data.lastSequenceId}`,
      );
    },
  });

  const initStore = async () => {
    const storeWorkspace = await tegonDatabase.workspaces.get({
      id: workspace.id,
    });

    if (storeWorkspace?.id && lastSequenceId) {
      setLoading(false);
      await syncRecords();
    } else {
      await bootstrapRecords();
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Syncing data..." />;
  }

  return <>{children}</>;
}
