import { computed } from 'mobx';
import * as React from 'react';

import type { LabelType } from 'common/types';

import { useProject } from 'hooks/projects';

import { useContextStore } from 'store/global-context-provider';

import { useCurrentTeam, useTeam } from '../teams/use-current-team';
import { useCurrentWorkspace } from '../workspace/use-current-workspace';

export function useTeamLabels(teamIdentifier: string) {
  const { labelsStore } = useContextStore();
  const currentWorkspace = useCurrentWorkspace();
  const team = useTeam(teamIdentifier);

  const getLabels = () => {
    let labels = labelsStore.labels.filter(
      (label: LabelType) =>
        label.workspaceId === currentWorkspace.id && label.teamId === null,
    );

    if (team) {
      const labelsForTeam = labelsStore.getLabelsForTeam(team.id);
      labels = [
        ...labels,
        ...labelsForTeam.filter(
          (label: LabelType) => !labels.includes(label.id),
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

export function useComputedLabels(): {
  labelMap: Record<string, { teamId: string; label: LabelType }>;
  uniqueLabelsByName: Record<string, LabelType>;
  labels: LabelType[];
} {
  const { labelsStore } = useContextStore();
  const team = useCurrentTeam();
  const project = useProject();

  const getLabels = () => {
    const labelMap: Record<string, { teamId: string; label: LabelType }> = {};
    const uniqueLabelsByName: Record<string, LabelType> = {};

    labelsStore.labels
      .filter((label: LabelType) => {
        if (!label.teamId) {
          return true;
        }

        if (team) {
          return label.teamId === team.id;
        }

        if (project) {
          return project.teams.includes(label.teamId);
        }

        return true;
      })
      .forEach((label: LabelType) => {
        // Use the label ID as the key for fast access
        labelMap[label.id] = {
          teamId: label.teamId,
          label, // Store the entire label object
        };

        // Group by label name while combining IDs
        if (!uniqueLabelsByName[label.name]) {
          uniqueLabelsByName[label.name] = {
            ids: [],
            ...label,
            id: '',
          }; // Store the first label object
        }
        if (!uniqueLabelsByName[label.name].ids.includes(label.id)) {
          uniqueLabelsByName[label.name].ids.push(label.id);
          uniqueLabelsByName[label.name].id =
            uniqueLabelsByName[label.name].ids.join('_');
        }
      });

    return {
      labelMap,
      uniqueLabelsByName,
      labels: Object.values(uniqueLabelsByName),
    };
  };

  const { labelMap, uniqueLabelsByName } = React.useMemo(
    () => computed(() => getLabels()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labelsStore, team],
  ).get();

  return {
    labelMap,
    uniqueLabelsByName,
    labels: Object.values(uniqueLabelsByName),
  };
}
