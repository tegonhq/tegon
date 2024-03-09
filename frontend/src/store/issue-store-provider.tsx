/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import * as React from 'react';

import { Loader } from 'components/ui/loader';

import { tegonDatabase } from './database';
import {
  initializeIssueHistoryStore,
  resetIssueHistoryStore,
} from './issue-history';
import { initializeIssuesStore } from './issues';
import { initializeWorkflowsStore } from './workflows';

export const IssueStoreProvider = observer(
  ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = React.useState(true);

    const {
      query: { issueId },
    } = useRouter();

    React.useEffect(() => {
      if (issueId) {
        initTeamBasedStored();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [issueId]);

    React.useEffect(() => {
      return () => {
        resetIssueHistoryStore();
      };
    }, []);

    // All data related to team
    const initTeamBasedStored = React.useCallback(async () => {
      setLoading(true);
      const id = (issueId as string).split('-')[1];
      const identifier = (issueId as string).split('-')[0];
      const teamData = await tegonDatabase.teams.get({
        identifier,
      });
      const issueData = await tegonDatabase.issues.get({
        number: parseInt(id),
      });

      await initializeWorkflowsStore(teamData?.id);
      await initializeIssuesStore(teamData?.id);
      await initializeIssueHistoryStore(issueData?.id);

      setLoading(false);
    }, [issueId]);

    if (loading) {
      return <Loader text="Loading issue" className="h-full" />;
    }

    return <>{children}</>;
  },
);
