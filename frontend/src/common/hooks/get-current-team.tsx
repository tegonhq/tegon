/* eslint-disable react-hooks/exhaustive-deps */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { computed } from 'mobx';
import { useRouter } from 'next/router';
import * as React from 'react';

import { TeamType } from 'common/types/team';

import { useTeamStore } from 'store/team';

export function useCurrentTeam(): TeamType | undefined {
  const { query } = useRouter();
  const teamStore = useTeamStore();

  const getTeam = () => {
    if (!query.teamIdentifier) {
      return undefined;
    }

    const team = teamStore.teams.find((team: TeamType) => {
      return team.identifier === query.teamIdentifier;
    });

    return team;
  };

  const team = React.useMemo(
    () => computed(() => getTeam()),
    [query.teamIdentifier, teamStore],
  ).get();

  return team;
}
