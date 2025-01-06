import { computed } from 'mobx';
import { useRouter } from 'next/router';
import React from 'react';

import type { CycleType } from 'common/types';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

export function useCycle(): CycleType {
  const { cyclesStore } = useContextStore();
  const team = useCurrentTeam();
  const {
    query: { cycleId },
  } = useRouter();

  const getCycle = () => {
    return cyclesStore.cycles.find((cycle: CycleType) => {
      if (!team) {
        return undefined;
      }

      if (cycleId === 'current') {
        return cycle.teamId === team?.id && team.currentCycle === cycle.number;
      }

      return cycle.teamId === team?.id && cycle.number.toString() === cycleId;
    });
  };

  const cycle = React.useMemo(
    () => computed(() => getCycle()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cyclesStore.cycles.length, team, cycleId],
  ).get();

  return cycle;
}
