/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';

import { Loader } from 'components/ui/loader';

import { tegonDatabase } from 'store/database';

import { useContextStore } from './global-context-provider';

interface TeamStoreProviderProps {
  defaultFilters?: string;
  children: React.ReactNode;
  teamIdentifier?: string;
}

export const TeamStoreInit = ({
  children,
  teamIdentifier: passedTeamIdentifier,
}: TeamStoreProviderProps) => {
  const [loading, setLoading] = React.useState(true);
  const { issuesStore, workflowsStore, applicationStore } = useContextStore();
  const pathname = usePathname();

  const {
    query: { teamIdentifier: queryTeamIdentifier },
  } = useRouter();

  const teamIdentifier = passedTeamIdentifier
    ? passedTeamIdentifier
    : queryTeamIdentifier;

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

    await issuesStore.load(teamData?.id);
    await workflowsStore.load(teamData?.id);
    await applicationStore.load(pathname);

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamIdentifier]);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
};
