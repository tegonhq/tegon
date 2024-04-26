/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { UseFormReturn } from 'react-hook-form';

import type {
  IntegrationAccountType,
  Settings,
} from 'common/types/integration-account';
import type { WorkflowType } from 'common/types/team';

import { draftKey } from './new-issues-type';
import { getDefaultStatus } from '../components/status-dropdown-utils';

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
}

export function getDefaultValues(
  workflows: WorkflowType[],
  pathname: string,
  isBidirectional: boolean,
): DefaultValues {
  const draftData = localStorage.getItem(draftKey);
  let defaultValues = {};

  if (draftData) {
    defaultValues = JSON.parse(draftData);
    localStorage.removeItem(draftKey);
  }

  return {
    labelIds: [],
    stateId: getDefaultStatus(workflows, pathname),
    priority: 0,
    isBidirectional,

    ...defaultValues,
  };
}

export function setDefaultValuesAgain(
  form: UseFormReturn,
  workflows: WorkflowType[],
  pathname: string,
  isBidirectional: boolean,
) {
  const defaultValues = getDefaultValues(workflows, pathname, isBidirectional);
  const defaultValuesKeys = Object.keys(defaultValues);

  defaultValuesKeys.forEach((key: keyof DefaultValues) => {
    form.setValue(key, defaultValues[key]);
  });
}
