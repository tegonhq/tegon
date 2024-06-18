/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { Loader } from 'components/ui/loader';
import { useCurrentWorkspace } from 'hooks/workspace';

import { useContextStore } from './global-context-provider';

export const WorkspaceStoreInit = observer(
  ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = React.useState(true);
    const {
      workspaceStore,
      teamsStore,
      labelsStore,
      integrationAccountsStore,
      integrationDefinitionsStore,
      issuesStore,
      workflowsStore,

      issueRelationsStore,
      notificationsStore,
      viewsStore,
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
      setLoading(true);

      await workspaceStore.load(currentWorkspace.id);
      await labelsStore.load();
      await teamsStore.load();
      await integrationDefinitionsStore.load();
      await integrationAccountsStore.load();
      await issuesStore.load();
      await workflowsStore.load();
      await issueRelationsStore.load();
      await notificationsStore.load();
      await viewsStore.load();

      console.log(workspaceStore.workspace);
      setLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWorkspace.id]);

    if (loading) {
      return <Loader text="Loading workspace" />;
    }

    return <>{children}</>;
  },
);
