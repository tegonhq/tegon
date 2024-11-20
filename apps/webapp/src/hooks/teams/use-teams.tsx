import type { TeamType } from 'common/types';

import { useProject } from 'hooks/projects';

import { useContextStore } from 'store/global-context-provider';

export function useTeams() {
  const { teamsStore } = useContextStore();
  const project = useProject();

  return project
    ? teamsStore.teams.filter((team: TeamType) =>
        project.teams.includes(team.id),
      )
    : (teamsStore.teams as TeamType[]);
}

export function useAllTeams() {
  const { teamsStore } = useContextStore();

  return teamsStore.teams as TeamType[];
}
