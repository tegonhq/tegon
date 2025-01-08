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
      await labelsStore.load();
      await teamsStore.load();
      await cyclesStore.load();
      await integrationAccountsStore.load();
      await issuesStore.load();
      await workflowsStore.load();
      await issueRelationsStore.load();
      await notificationsStore.load();
      await viewsStore.load();
      await viewsStore.load();
      await issueSuggestionsStore.load();
      await actionsStore.load();
      await projectsStore.load();
      await projectMilestonesStore.load();
      await conversationsStore.load();
      await conversationHistoryStore.load();
      await templatesStore.load();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWorkspace.id]);

    return <>{children}</>;
  },
);
