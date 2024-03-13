/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';

import { Loader } from 'components/ui/loader';

import { tegonDatabase } from 'store/database';
import { initializeIssuesStore } from 'store/issues';
import { initializeWorkflowsStore } from 'store/workflows';

import { initApplicationStore } from './application';

interface TeamStoreProviderProps {
  defaultFilters?: string;
  children: React.ReactNode;
}

export const TeamStoreProvider = observer(
  ({ children, defaultFilters }: TeamStoreProviderProps) => {
    const [loading, setLoading] = React.useState(true);
    const pathname = usePathname();

    const {
      query: { teamIdentifier },
    } = useRouter();

    React.useEffect(() => {
      if (teamIdentifier) {
        initTeamBasedStore();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamIdentifier]);

    // All data related to team
    const initTeamBasedStore = React.useCallback(async () => {
      setLoading(true);

      const teamData = await tegonDatabase.teams.get({
        identifier: teamIdentifier,
      });

      await initApplicationStore(pathname, defaultFilters);
      await initializeWorkflowsStore(teamData?.id);
      await initializeIssuesStore(teamData?.id);

      setLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamIdentifier]);

    if (loading) {
      return <Loader />;
    }

    return <>{children}</>;
  },
);
