/* eslint-disable react-hooks/exhaustive-deps */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useRouter } from 'next/router';
import * as React from 'react';

import { TeamType } from 'common/types/team';

import { useTeamStore } from 'store/teams';

export function useTeam(): TeamType | undefined {
  const { query } = useRouter();
  const teamStore = useTeamStore();

  const getTeam = () => {
    if (!query.teamIdentifier) {
      return undefined;
    }

    return teamStore.teams.find(
      (team: TeamType) => team.identifier === query.teamIdentifier,
    );
  };

  const team = React.useMemo(() => getTeam(), [query.teamIdentifier]);

  return team;
}
