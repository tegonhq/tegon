/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { computed } from 'mobx';
import { useRouter } from 'next/router';
import * as React from 'react';

import type { IssueType } from 'common/types/issue';

import { useCurrentTeam } from 'hooks/teams';

import { useIssuesStore } from './use-issues-store';

export function useIssueData() {
  const {
    query: { issueId },
  } = useRouter();
  const currentTeam = useCurrentTeam();
  const issuesStore = useIssuesStore();

  const getIssue = () => {
    if (!issueId) {
      return undefined;
    }

    const issue = issuesStore.issues.find((issue: IssueType) => {
      return `${issue.number}` === (issueId as string).split('-')[1];
    });

    const computedIssue = { ...issue };

    computedIssue.parent = issuesStore.issues.find((is: IssueType) => {
      return is.id === issue.parentId;
    });

    computedIssue.children = issuesStore.issues.filter((is: IssueType) => {
      return is.parentId === issue.id;
    });

    return computedIssue;
  };

  const issue = React.useMemo(
    () => computed(() => getIssue()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [issueId, currentTeam, issuesStore],
  ).get();

  return issue;
}
