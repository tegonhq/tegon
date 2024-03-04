/* eslint-disable react-hooks/exhaustive-deps */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { computed } from 'mobx';
import * as React from 'react';

import { WorkflowType } from 'common/types/team';

import { useWorkflowStore } from 'store/workflows';

import { useCurrentTeam } from './use-current-team';

export function useTeamWorkflows(): WorkflowType[] | undefined {
  const currentTeam = useCurrentTeam();
  const workflowStore = useWorkflowStore();

  const getWorkflows = () => {
    if (!currentTeam) {
      return [];
    }

    const workflows = workflowStore.workflows.filter(
      (workflow: WorkflowType) => {
        return workflow.teamId === currentTeam.id;
      },
    );

    return workflows;
  };

  const workflows = React.useMemo(
    () => computed(() => getWorkflows()),
    [currentTeam, workflowStore],
  ).get();

  return workflows;
}
