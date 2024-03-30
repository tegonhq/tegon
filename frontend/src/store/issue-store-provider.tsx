/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import * as React from 'react';

import { Loader } from 'components/ui/loader';

import { tegonDatabase } from './database';
import { useContextStore } from './global-context-provider';

export const IssueStoreInit = observer(
  ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = React.useState(true);
    const {
      issuesHistoryStore,
      commentsStore,

      linkedIssuesStore,
    } = useContextStore();

    const {
      query: { issueId },
    } = useRouter();

    React.useEffect(() => {
      if (issueId) {
        initIssueBasedStored();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [issueId]);

    // All data related to team
    const initIssueBasedStored = React.useCallback(async () => {
      setLoading(true);
      const id = (issueId as string).split('-')[1];
      const issueData = await tegonDatabase.issues.get({
        number: parseInt(id),
      });

      await issuesHistoryStore.load(issueData.id);
      await commentsStore.load(issueData.id);
      await linkedIssuesStore.load(issueData.id);

      setLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [issueId]);

    if (loading) {
      return <Loader text="Loading issue data" className="h-full" />;
    }

    return <>{children}</>;
  },
);
