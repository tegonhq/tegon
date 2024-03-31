/* eslint-disable react-hooks/exhaustive-deps */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { computed } from 'mobx';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { WorkflowCategoryEnum, type WorkflowType } from 'common/types/team';

import { useContextStore } from 'store/global-context-provider';

import { useTeam } from '../teams/use-current-team';

const categorySequence = [
  WorkflowCategoryEnum.TRIAGE,
  WorkflowCategoryEnum.BACKLOG,
  WorkflowCategoryEnum.UNSTARTED,
  WorkflowCategoryEnum.STARTED,
  WorkflowCategoryEnum.COMPLETED,
  WorkflowCategoryEnum.CANCELED,
];

function workflowSort(a: WorkflowType, b: WorkflowType): number {
  // Compare categories based on their sequence
  const categoryAIndex = categorySequence.indexOf(a.category);
  const categoryBIndex = categorySequence.indexOf(b.category);
  if (categoryAIndex !== categoryBIndex) {
    return categoryAIndex - categoryBIndex;
  }

  // If categories are the same, compare by position
  return b.position - a.position;
}

export function useTeamWorkflows(
  teamIdentfier: string,
): WorkflowType[] | undefined {
  const team = useTeam(teamIdentfier);
  const pathname = usePathname();
  const { workflowsStore } = useContextStore();

  function getWorkflowCategories() {
    if (pathname.includes('/active')) {
      return [WorkflowCategoryEnum.UNSTARTED, WorkflowCategoryEnum.STARTED];
    }

    if (pathname.includes('/backlog')) {
      return [WorkflowCategoryEnum.BACKLOG];
    }

    if (pathname.includes('/triage')) {
      return [WorkflowCategoryEnum.TRIAGE];
    }

    return Object.values(WorkflowCategoryEnum);
  }

  const workflowCategories = React.useMemo(
    () => getWorkflowCategories(),
    [workflowsStore],
  );

  const getWorkflows = () => {
    if (!team) {
      return [];
    }

    const workflows = workflowsStore.workflows.filter(
      (workflow: WorkflowType) => {
        return (
          workflow.teamId === team.id &&
          workflowCategories.includes(workflow.category)
        );
      },
    );

    return workflows;
  };

  const workflows = React.useMemo(
    () => computed(() => getWorkflows()),
    [team, workflowsStore],
  ).get();

  return workflows;
}

export function useAllTeamWorkflows(
  teamIdentfier: string,
): WorkflowType[] | undefined {
  const team = useTeam(teamIdentfier);
  const { workflowsStore } = useContextStore();
  const workflowCategories = Object.values(WorkflowCategoryEnum);

  const getWorkflows = () => {
    if (!team) {
      return [];
    }

    const workflows = workflowsStore.workflows
      .filter((workflow: WorkflowType) => {
        return (
          workflow.teamId === team.id &&
          workflowCategories.includes(workflow.category)
        );
      })
      .sort(workflowSort);

    return workflows;
  };

  const workflows = React.useMemo(
    () => computed(() => getWorkflows()),
    [team, workflowsStore],
  ).get();

  return workflows;
}
