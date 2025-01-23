import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useCurrentWorkspace } from 'hooks/workspace';

import { useContextStore } from './global-context-provider';

export const WorkspaceStoreInit = observer(
  ({ children }: { children: React.ReactNode }) => {
    const {
      workspaceStore,
      teamsStore,
      labelsStore,
      integrationAccountsStore,
      issuesStore,
      workflowsStore,

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
      templatesStore,
    } = useContextStore();

    const currentWorkspace = useCurrentWorkspace();

    React.useEffect(() => {
      if (currentWorkspace) {
        // Setting this to help upload the images to this workspace
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).workspaceId = currentWorkspace.id;
        initWorkspaceBasedStores();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWorkspace]);

    // All data related to workspace
    const initWorkspaceBasedStores = React.useCallback(async () => {
      await workspaceStore.load(currentWorkspace.id);
      await workflowsStore.load();
      await Promise.all([
        labelsStore.load(),
        teamsStore.load(),
        cyclesStore.load(),
        integrationAccountsStore.load(),
        issuesStore.load(),
        issueRelationsStore.load(),
        notificationsStore.load(),
        viewsStore.load(),
        issueSuggestionsStore.load(),
        actionsStore.load(),
        projectsStore.load(),
        projectMilestonesStore.load(),
        conversationsStore.load(),
        conversationHistoryStore.load(),
        templatesStore.load(),
      ]);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWorkspace.id]);

    return <>{children}</>;
  },
);
