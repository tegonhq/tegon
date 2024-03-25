/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
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
      applicationStore,
    } = useContextStore();
    const {
      query: { teamIdentifier },
    } = useRouter();
    const pathname = usePathname();

    const currentWorkspace = useCurrentWorkspace();

    React.useEffect(() => {
      if (currentWorkspace) {
        initWorkspaceBasedStores();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWorkspace]);

    React.useEffect(() => {
      initTeamBasedStore();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamIdentifier]);

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

      setLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWorkspace.id]);

    // All data related to team
    const initTeamBasedStore = React.useCallback(async () => {
      await applicationStore.load(pathname);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamIdentifier]);

    if (loading) {
      return <Loader text="Loading workspace" />;
    }

    return <>{children}</>;
  },
);
