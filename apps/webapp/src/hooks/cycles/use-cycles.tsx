import { computed } from 'mobx';
import React from 'react';

import type { CycleType } from 'common/types';

import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

export function useCycles(): {
  cycles: CycleType[];
} {
  const { cyclesStore } = useContextStore();
  const team = useCurrentTeam();
  const project = useProject();

  const getCycles = () => {
    return cyclesStore.cycles.filter((cycle: CycleType) => {
      if (team) {
        return cycle.teamId === team.id;
      }

      if (project) {
        return project.teams.includes(cycle.teamId);
      }

      return true;
    });
  };

  const cycles = React.useMemo(
    () => computed(() => getCycles()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cyclesStore.cycles.length, team, project],
  ).get();

  return {
    cycles,
  };
}
