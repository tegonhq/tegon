/* eslint-disable react-hooks/exhaustive-deps */
import type { TeamType } from '@tegonhq/types';

import { computed } from 'mobx';
import { useRouter } from 'next/router';
import * as React from 'react';

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

export function useTeamWithId(teamId: string): TeamType | undefined {
  const { teamsStore } = useContextStore();

  const getTeam = () => {
    const team = teamsStore.getTeamWithId(teamId);

    return team;
  };

  const team = React.useMemo(
    () => computed(() => getTeam()),
    [teamId, teamsStore],
  ).get();

  return team;
}
