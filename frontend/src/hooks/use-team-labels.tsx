/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { computed } from 'mobx';
import * as React from 'react';

import { LabelType } from 'common/types/label';

import { useLabelStore } from 'store/labels';

import { useCurrentTeam } from './use-current-team';
import { useCurrentWorkspace } from './use-current-workspace';

export function useTeamLabels() {
  const labelsStore = useLabelStore();
  const currentWorkspace = useCurrentWorkspace();
  const currentTeam = useCurrentTeam();

  const getLabels = () => {
    let labels = labelsStore.labels.filter(
      (label: LabelType) => label.workspaceId === currentWorkspace.id,
    );

    if (currentTeam) {
      labels = [
        ...labels,
        ...labelsStore.labels.filter(
          (label: LabelType) =>
            label.teamId === currentTeam.id && labels.includes(label.id),
        ),
      ];
    }

    return labels;
  };

  const workflows = React.useMemo(
    () => computed(() => getLabels()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTeam, currentWorkspace, labelsStore],
  ).get();

  return workflows;
}
