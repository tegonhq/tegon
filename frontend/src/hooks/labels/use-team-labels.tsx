/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { computed } from 'mobx';
import * as React from 'react';

import type { LabelType } from 'common/types/label';

import { useContextStore } from 'store/global-context-provider';

import { useCurrentTeam } from '../teams/use-current-team';
import { useCurrentWorkspace } from '../workspace/use-current-workspace';

export function useTeamLabels() {
  const { labelsStore } = useContextStore();
  const currentWorkspace = useCurrentWorkspace();
  const currentTeam = useCurrentTeam();

  const getLabels = () => {
    const labelsForTeam = labelsStore.getLabelsForTeam(currentTeam.id);
    let labels = labelsStore.labels.filter(
      (label: LabelType) => label.workspaceId === currentWorkspace.id,
    );

    if (currentTeam) {
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
    [currentTeam, currentWorkspace, labelsStore],
  ).get();

  return labels;
}
