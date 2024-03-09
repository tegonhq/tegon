/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { Loader } from 'components/ui/loader';
import { useCurrentWorkspace } from 'hooks/workspace';

import { initialiseLabelStore } from 'store/labels';
import { initialiseTeamsStore } from 'store/teams';
import { initialiseWorkspaceStore } from 'store/workspace';

export const WorkspaceStoreProvider = observer(
  ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = React.useState(true);

    const currentWorkspace = useCurrentWorkspace();

    React.useEffect(() => {
      if (currentWorkspace) {
        initWorkspaceBasedStores();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWorkspace]);

    // All data related to workspace
    const initWorkspaceBasedStores = React.useCallback(async () => {
      setLoading(true);

      await initialiseWorkspaceStore(currentWorkspace.id);
      await initialiseLabelStore(currentWorkspace.id);
      await initialiseTeamsStore(currentWorkspace.id);

      setLoading(false);
    }, [currentWorkspace.id]);

    if (loading) {
      return <Loader text="Loading workspace" />;
    }

    return <>{children}</>;
  },
);
