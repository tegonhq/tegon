/* eslint-disable react-hooks/exhaustive-deps */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { computed } from 'mobx';
import * as React from 'react';

import type { WorkflowType } from 'common/types/team';

import { useWorkflowsStore } from './use-workflows-store';
import { useCurrentTeam } from '../teams/use-current-team';

export function useTeamWorkflows(): WorkflowType[] | undefined {
  const currentTeam = useCurrentTeam();
  const workflowStore = useWorkflowsStore();

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
