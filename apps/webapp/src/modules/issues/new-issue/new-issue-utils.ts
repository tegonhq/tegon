import type { UseFormReturn } from 'react-hook-form';

import { WorkflowCategory } from '@tegonhq/types';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import type { IssueType, TeamType, WorkflowType } from 'common/types';

import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';
import { UserContext } from 'store/user-context';

interface DefaultValues {
  labelIds: string[];
  priority: number;
  stateId: string;
  description?: string;
  teamId?: string;
}

export function getDefaultValues(
  teamId: string,
  workflows: WorkflowType[],
): DefaultValues {
  return {
    teamId,
    labelIds: [],
    stateId: workflows.find(
      (workflow: WorkflowType) => workflow.name === 'Backlog',
    ).id,
    priority: 0,
  };
}

export function setDefaultValuesAgain({
  form,
  index,
  defaultValues,
}: {
  form: UseFormReturn;
  index: number;
  defaultValues: Partial<IssueType>;
}) {
  const defaultValuesKeys = Object.keys(defaultValues);

  defaultValuesKeys.forEach((key: keyof DefaultValues) => {
    form.setValue(`issues.${index}.${key}`, defaultValues[key]);
  });
}

export const useDefaultValues = (
  team: TeamType,
  defaultValues: Partial<IssueType>,
) => {
  const project = useProject();
  const { workflowsStore } = useContextStore();
  const user = React.useContext(UserContext);
  const workflows = workflowsStore.getWorkflowsForTeam(team.id);

  return React.useMemo(() => {
    return {
      teamId: team?.id,
      projectId: project?.id,
      parentId: defaultValues.parentId,
      labelIds: [] as string[],
      stateId: getBacklogWorkflow(workflows).id,
      priority: 0,
      assigneeId: user?.id,
      ...defaultValues,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team, project]);
};

export function useTeamForNewIssue(defaultTeamId: string): {
  team: TeamType;
  setTeam: (identifier: string) => void;
} {
  const { teamsStore } = useContextStore();
  const teams = teamsStore.teams;
  const currentTeam = useCurrentTeam();
  const project = useProject();

  const getDefaultTeamId = () => {
    if (defaultTeamId) {
      return teams.find((team: TeamType) => team.id === defaultTeamId);
    }

    if (currentTeam) {
      return currentTeam;
    }

    if (project) {
      return teams.find((team: TeamType) => team.id === project.teams[0]);
    }

    return teams[0];
  };

  const [team, setTeam] = React.useState(getDefaultTeamId());

  const setTeamWithIdentifier = (identifier: string) => {
    setTeam(teams.find((team: TeamType) => team.identifier === identifier));
  };

  return { team, setTeam: setTeamWithIdentifier };
}

export function useDescriptionChange(
  touched: boolean,
  value: string,
  callback: (description: string) => void,
  delay = 500,
  threshold = 5,
) {
  const [prevValue, setPrevValue] = useState(value);

  const hasSignificantChange = (newValue: string, oldValue: string) => {
    if (!oldValue) {
      return true;
    }
    // Define what constitutes a "significant" change
    // This is a simple example, customize it based on your needs
    return Math.abs(newValue.length - oldValue.length) > threshold;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCallback = useCallback(
    useDebouncedCallback((newValue) => {
      if (hasSignificantChange(newValue, prevValue) && !touched) {
        callback(newValue);
        setPrevValue(newValue);
      }
    }, delay),
    [prevValue, callback, delay, touched],
  );

  useEffect(() => {
    if (value) {
      debouncedCallback(value);
    }
  }, [value, debouncedCallback]);

  return {
    prevValue,
  };
}

export function getBacklogWorkflow(workflows: WorkflowType[]) {
  const findBacklog = workflows.find((workflow) =>
    workflow.name.toLowerCase().includes('backlog'),
  );

  if (findBacklog) {
    return findBacklog;
  }

  return workflows.find(
    (workflow) => workflow.category === WorkflowCategory.BACKLOG,
  );
}
