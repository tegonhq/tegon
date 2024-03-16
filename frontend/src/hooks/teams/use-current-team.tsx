/* eslint-disable react-hooks/exhaustive-deps */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { computed } from 'mobx';
import { useRouter } from 'next/router';
import * as React from 'react';

import type { TeamType } from 'common/types/team';

import { useContextStore } from 'store/global-context-provider';

export function useCurrentTeam(): TeamType | undefined {
  const {
    query: { teamIdentifier, issueId },
  } = useRouter();
  const { teamsStore } = useContextStore();

  const getTeam = () => {
    if (!teamIdentifier && !issueId) {
      return undefined;
    }

    const identifier = teamIdentifier
      ? teamIdentifier
      : (issueId as string).split('-')[0];

    const team = teamsStore.teams.find((team: TeamType) => {
      return team.identifier === identifier;
    });

    return team;
  };

  const team = React.useMemo(
    () => computed(() => getTeam()),
    [teamIdentifier, issueId, teamsStore],
  ).get();

  return team;
}

export function useTeam(teamIdentifier: string): TeamType | undefined {
  const { teamsStore } = useContextStore();

  const getTeam = () => {
    const team = teamsStore.teams.find((team: TeamType) => {
      return team.identifier === teamIdentifier;
    });

    return team;
  };

  const team = React.useMemo(
    () => computed(() => getTeam()),
    [teamIdentifier, teamsStore],
  ).get();

  return team;
}
