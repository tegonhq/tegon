/** Copyright (c) 2024, Tegon, all rights reserved. **/
'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import { tegonDatabase } from './database';
import { useContextStore } from './global-context-provider';

export const IssueStoreInit = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = React.useState(true);
  const { issuesHistoryStore, commentsStore, linkedIssuesStore } =
    useContextStore();

  const { issueId } = useParams();

  const teamIdentifier = (issueId as string).split('-')[0];

  // All data related to team
  const initIssueBasedStored = React.useCallback(async () => {
    setLoading(true);
    const id = (issueId as string).split('-')[1];

    const team = await tegonDatabase.teams.get({
      identifier: teamIdentifier,
    });

    const issueData = await tegonDatabase.issues.get({
      number: parseInt(id),
      teamId: team.id,
    });

    await issuesHistoryStore.load(issueData.id);
    await commentsStore.load(issueData.id);
    await linkedIssuesStore.load(issueData.id);

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueId]);

  React.useEffect(() => {
    if (issueId) {
      initIssueBasedStored();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueId]);

  if (loading) {
    return null;
  }

  return (
    <>
      {children}
      {issueId}
    </>
  );
};
