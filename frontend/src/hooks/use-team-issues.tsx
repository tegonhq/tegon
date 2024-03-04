/* eslint-disable react-hooks/exhaustive-deps */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { computed } from 'mobx';
import * as React from 'react';

import { IssueType } from 'common/types/issue';

import { useIssuesStore } from 'store/issues';

import { useCurrentTeam } from './use-current-team';

export function useTeamIssues(): IssueType[] | undefined {
  const currentTeam = useCurrentTeam();
  const issuesStore = useIssuesStore();

  const getIssues = () => {
    if (!currentTeam) {
      return [];
    }

    const issues = issuesStore.issues.filter((issue: IssueType) => {
      return issue.teamId === currentTeam.id;
    });

    return issues;
  };

  const issues = React.useMemo(
    () => computed(() => getIssues()),
    [currentTeam, issuesStore],
  ).get();

  return issues;
}
