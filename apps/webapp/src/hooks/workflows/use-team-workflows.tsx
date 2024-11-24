/* eslint-disable react-hooks/exhaustive-deps */
import { WorkflowCategoryEnum } from '@tegonhq/types';
import { computed } from 'mobx';
import * as React from 'react';

import { type WorkflowType } from 'common/types';

import { useProject } from 'hooks/projects';

import { useContextStore } from 'store/global-context-provider';

import { useCurrentTeam, useTeam } from '../teams/use-current-team';

const categorySequence = [
  WorkflowCategoryEnum.BACKLOG,
  WorkflowCategoryEnum.UNSTARTED,
  WorkflowCategoryEnum.STARTED,
  WorkflowCategoryEnum.COMPLETED,
  WorkflowCategoryEnum.CANCELED,
  WorkflowCategoryEnum.TRIAGE,
];

export function workflowSort(a: WorkflowType, b: WorkflowType): number {
  // Compare categories based on their sequence
  const categoryAIndex = categorySequence.indexOf(
    a.category as WorkflowCategoryEnum,
  );
  const categoryBIndex = categorySequence.indexOf(
    b.category as WorkflowCategoryEnum,
  );
  if (categoryAIndex !== categoryBIndex) {
    return categoryAIndex - categoryBIndex;
  }

  // If categories are the same, compare by position
  return a.position - b.position;
}

export function useTeamWorkflows(
  teamIdentifier: string,
): WorkflowType[] | undefined {
  const team = useTeam(teamIdentifier);
  const { workflowsStore } = useContextStore();

  const getWorkflows = () => {
    if (!team) {
      return [];
    }

    const workflows = workflowsStore.workflows
      .filter((workflow: WorkflowType) => {
        return workflow.teamId === team.id;
      })
      .sort(workflowSort);

    return workflows;
  };

  const workflows = React.useMemo(
    () => computed(() => getWorkflows()),
    [team, workflowsStore.workflows.length, teamIdentifier],
  ).get();

  return workflows;
}

export function useAllWorkflows(): WorkflowType[] | undefined {
  const { workflowsStore } = useContextStore();

  const getWorkflows = () => {
    const workflows = workflowsStore.workflows.sort(workflowSort);

    return workflows;
  };

  const workflows = React.useMemo(
    () => computed(() => getWorkflows()),
    [workflowsStore],
  ).get();

  return workflows;
}

export function useComputedWorkflows(): {
  workflowMap: Record<string, { teamId: string; workflow: WorkflowType }>;
  uniqueWorkflowsByName: Record<string, WorkflowType>;
  workflows: WorkflowType[];
} {
  const { workflowsStore } = useContextStore();
  const team = useCurrentTeam();
  const project = useProject();

  const getWorkflows = () => {
    const workflowMap: Record<
      string,
      { teamId: string; workflow: WorkflowType }
    > = {};
    const uniqueWorkflowsByName: Record<string, WorkflowType> = {};

    workflowsStore.workflows
      .filter((workflow: WorkflowType) => {
        if (team) {
          return workflow.teamId === team.id;
        }

        if (project) {
          return project.teams.includes(workflow.teamId);
        }

        return true;
      })
      .forEach((workflow: WorkflowType) => {
        // Use the workflow ID as the key for fast access
        workflowMap[workflow.id] = {
          teamId: workflow.teamId,
          workflow, // Store the entire workflow object
        };

        // Group by workflow name while combining IDs
        if (!uniqueWorkflowsByName[workflow.name]) {
          uniqueWorkflowsByName[workflow.name] = {
            ids: [],
            ...workflow,
            id: '',
          }; // Store the first workflow object
        }
        if (!uniqueWorkflowsByName[workflow.name].ids.includes(workflow.id)) {
          uniqueWorkflowsByName[workflow.name].ids.push(workflow.id);
          uniqueWorkflowsByName[workflow.name].id =
            uniqueWorkflowsByName[workflow.name].ids.join('_');
        }
      });

    return {
      workflowMap,
      uniqueWorkflowsByName,
      workflows: Object.values(uniqueWorkflowsByName),
    };
  };

  const { workflowMap, uniqueWorkflowsByName } = React.useMemo(
    () => computed(() => getWorkflows()),
    [workflowsStore, team],
  ).get();

  return {
    workflowMap,
    uniqueWorkflowsByName,
    workflows: Object.values(uniqueWorkflowsByName),
  };
}
