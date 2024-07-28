import type { UseFormReturn } from 'react-hook-form';

import React from 'react';

import type {
  IntegrationAccountType,
  Settings,
} from 'common/types/integration-account';
import type { TeamType, WorkflowType } from 'common/types/team';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

export function enableBidirectionalSwitch(
  githubAccounts: IntegrationAccountType[],
  teamId: string,
) {
  let enableBidirectionalSwitch = false;

  githubAccounts.forEach((githubAccount: IntegrationAccountType) => {
    const settings: Settings = JSON.parse(githubAccount.settings);

    settings.Github.repositoryMappings.forEach((mapping) => {
      if (mapping.teamId === teamId && mapping.default) {
        enableBidirectionalSwitch = true;
      }
    });
  });

  return enableBidirectionalSwitch;
}

export function isBidirectionalEnabled(
  githubAccounts: IntegrationAccountType[],
  teamId: string,
) {
  let isBirectionalEnabled = false;

  githubAccounts.forEach((githubAccount: IntegrationAccountType) => {
    const settings: Settings = JSON.parse(githubAccount.settings);

    settings.Github.repositoryMappings.forEach((mapping) => {
      if (
        mapping.teamId === teamId &&
        mapping.default &&
        mapping.bidirectional
      ) {
        isBirectionalEnabled = true;
      }
    });
  });

  return isBirectionalEnabled;
}

interface DefaultValues {
  labelIds: string[];
  priority: number;
  isBidirectional: boolean;
  stateId: string;
  description?: string;
  teamId?: string;
}

export function getDefaultValues(
  teamId: string,
  workflows: WorkflowType[],
  isBidirectional: boolean,
): DefaultValues {
  return {
    teamId,
    labelIds: [],
    stateId: workflows.find(
      (workflow: WorkflowType) => workflow.name === 'Backlog',
    ).id,
    priority: 0,
    isBidirectional,
  };
}

export function setDefaultValuesAgain({
  form,
  index,
  workflows,
  isBidirectional,
  teamId,
}: {
  form: UseFormReturn;
  index: number;
  workflows: WorkflowType[];
  isBidirectional: boolean;
  teamId: string;
}) {
  const defaultValues = getDefaultValues(teamId, workflows, isBidirectional);

  const defaultValuesKeys = Object.keys(defaultValues);

  defaultValuesKeys.forEach((key: keyof DefaultValues) => {
    form.setValue(`issues.${index}.${key}`, defaultValues[key]);
  });
}

export function useTeamForNewIssue(): {
  team: TeamType;
  setTeam: (identifier: string) => void;
} {
  const { teamsStore } = useContextStore();
  const currentTeam = useCurrentTeam();
  const teams = teamsStore.teams;

  const [team, setTeam] = React.useState(currentTeam ?? teams[0]);

  const setTeamWithIdentifier = (identifier: string) => {
    setTeam(teams.find((team: TeamType) => team.identifier === identifier));
  };

  return { team, setTeam: setTeamWithIdentifier };
}
