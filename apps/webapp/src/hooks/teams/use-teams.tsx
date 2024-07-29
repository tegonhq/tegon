import type { TeamType } from '@tegonhq/types';

import { useContextStore } from 'store/global-context-provider';

export function useTeams() {
  const { teamsStore } = useContextStore();

  return teamsStore.teams as TeamType[];
}
