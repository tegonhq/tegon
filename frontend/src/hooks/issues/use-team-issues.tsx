/* eslint-disable dot-location */
/* eslint-disable react-hooks/exhaustive-deps */
/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { computed } from 'mobx';
import * as React from 'react';

import type { IssueType } from 'common/types/issue';

import { useIssuesStore } from './use-issues-store';
import { useCurrentTeam } from '../teams/use-current-team';

export function useTeamIssues(): IssueType[] | undefined {
  const currentTeam = useCurrentTeam();
  const issuesStore = useIssuesStore();

  const getIssues = () => {
    if (!currentTeam) {
      return [];
    }

    const issues = issuesStore.issues
      .filter((issue: IssueType) => {
        return issue.teamId === currentTeam.id;
      })
      .map((issue: IssueType) => {
        const completeIssue = { ...issue };

        if (issue.parentId) {
          completeIssue.parent = issuesStore.issues.find(
            (is: IssueType) => is.id === issue.parentId,
          );
        }

        completeIssue.children = issuesStore.issues.find(
          (is: IssueType) => is.parentId === issue.id,
        );

        return completeIssue;
      });

    return issues;
  };

  const issues = React.useMemo(
    () => computed(() => getIssues()),
    [currentTeam, issuesStore],
  ).get();

  return issues;
}
