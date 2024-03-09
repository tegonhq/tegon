/* eslint-disable react-hooks/exhaustive-deps */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { computed } from 'mobx';
import { useRouter } from 'next/router';
import * as React from 'react';

import type { TeamType } from 'common/types/team';

import { useTeamsStore } from './use-teams-store';

export function useCurrentTeam(): TeamType | undefined {
  const {
    query: { teamIdentifier, issueId },
  } = useRouter();
  const teamStore = useTeamsStore();

  const getTeam = () => {
    if (!teamIdentifier && !issueId) {
      return undefined;
    }

    const identifier = teamIdentifier
      ? teamIdentifier
      : (issueId as string).split('-')[0];

    const team = teamStore.teams.find((team: TeamType) => {
      return team.identifier === identifier;
    });

    return team;
  };

  const team = React.useMemo(
    () => computed(() => getTeam()),
    [teamIdentifier, issueId, teamStore],
  ).get();

  return team;
}
