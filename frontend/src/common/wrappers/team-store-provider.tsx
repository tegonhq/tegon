/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import * as React from 'react';

import { Loader } from 'components/ui/loader';

import { tegonDatabase } from 'store/database';
import { initializeIssuesStore } from 'store/issues';
import { initializeWorkflowsStore } from 'store/workflows';

export const TeamStoreProvider = observer(
  ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = React.useState(true);

    const {
      query: { teamIdentifier, issueId },
    } = useRouter();

    React.useEffect(() => {
      if (teamIdentifier || issueId) {
        initTeamBasedStored();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamIdentifier, issueId]);

    // All data related to team
    const initTeamBasedStored = React.useCallback(async () => {
      setLoading(true);

      const teamData = await tegonDatabase.teams.get({
        identifier: teamIdentifier
          ? teamIdentifier
          : (issueId as string).split('-')[0],
      });

      await initializeWorkflowsStore(teamData?.id);
      await initializeIssuesStore(teamData?.id);

      setLoading(false);
    }, [teamIdentifier, issueId]);

    if (loading) {
      return <Loader />;
    }

    return <>{children}</>;
  },
);
