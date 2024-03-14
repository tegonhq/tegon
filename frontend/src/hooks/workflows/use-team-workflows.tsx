/* eslint-disable react-hooks/exhaustive-deps */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { computed } from 'mobx';
import * as React from 'react';

import type { WorkflowType } from 'common/types/team';

import { useWorkflowsStore } from './use-workflows-store';
import { useTeam } from '../teams/use-current-team';

export function useTeamWorkflows(
  teamIdentfier: string,
): WorkflowType[] | undefined {
  const team = useTeam(teamIdentfier);
  const workflowStore = useWorkflowsStore();

  const getWorkflows = () => {
    if (!team) {
      return [];
    }

    const workflows = workflowStore.workflows.filter(
      (workflow: WorkflowType) => {
        return workflow.teamId === team.id;
      },
    );

    return workflows;
  };

  const workflows = React.useMemo(
    () => computed(() => getWorkflows()),
    [team, workflowStore],
  ).get();

  return workflows;
}
