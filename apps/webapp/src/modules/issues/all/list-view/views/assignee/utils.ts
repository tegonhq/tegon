import { sort } from 'fast-sort';

import { type IssueType, type User } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { getIssueRows } from '../../list-view-utils';

export const useIssueRowsAssignee = (issues: IssueType[], users: User[]) => {
  const {
    applicationStore: {
      displaySettings: { showEmptyGroups },
    },
    issuesStore,
    issueRelationsStore,
  } = useContextStore();

  return getIssueRows(
    issues,
    'assigneeId',
    sort(users)
      .asc((user) => user.fullname)
      .map((user) => user.id),
    showEmptyGroups,
    issuesStore,
    issueRelationsStore,
  );
};
