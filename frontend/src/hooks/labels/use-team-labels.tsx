/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { computed } from 'mobx';
import * as React from 'react';

import type { LabelType } from 'common/types/label';

import { useContextStore } from 'store/global-context-provider';

import { useTeam } from '../teams/use-current-team';
import { useCurrentWorkspace } from '../workspace/use-current-workspace';

export function useTeamLabels(teamIdentfier: string) {
  const { labelsStore } = useContextStore();
  const currentWorkspace = useCurrentWorkspace();
  const team = useTeam(teamIdentfier);

  const getLabels = () => {
    const labelsForTeam = labelsStore.getLabelsForTeam(team.id);
    let labels = labelsStore.labels.filter(
      (label: LabelType) => label.workspaceId === currentWorkspace.id,
    );

    if (team) {
      labels = [
        ...labels,
        ...labelsForTeam.filter((label: LabelType) =>
          labels.includes(label.id),
        ),
      ];
    }

    return labels;
  };

  const labels = React.useMemo(
    () => computed(() => getLabels()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [team, currentWorkspace, labelsStore],
  ).get();

  return labels;
}
