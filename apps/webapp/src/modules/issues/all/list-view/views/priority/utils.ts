import { type IssueType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { getIssueRows } from '../../list-view-utils';

export const useIssueRowsPriority = (
  issues: IssueType[],
  Priorities: string[],
) => {
  const {
    applicationStore: {
      displaySettings: { showEmptyGroups },
    },
    issuesStore,
    issueRelationsStore,
  } = useContextStore();

  const reorderedPriorities = Priorities.filter((p) => p !== '').concat(['']);

  return getIssueRows(
    issues,
    'priority',
    reorderedPriorities.map((priority) =>
      Priorities.indexOf(priority).toString(),
    ),

    showEmptyGroups,
    issuesStore,
    issueRelationsStore,
  );
};
