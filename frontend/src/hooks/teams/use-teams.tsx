/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { TeamType } from 'common/types/team';

import { useContextStore } from 'store/global-context-provider';

export function useTeams() {
  const { teamsStore } = useContextStore();

  return teamsStore.teams as TeamType[];
}
