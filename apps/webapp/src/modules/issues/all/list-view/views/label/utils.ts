import { sort } from 'fast-sort';

import { type IssueType, type LabelType } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { getIssueRows } from '../../list-view-utils';

export const useIssueRowsLabel = (issues: IssueType[], labels: LabelType[]) => {
  const {
    applicationStore: {
      displaySettings: { showEmptyGroups },
    },
    issuesStore,
    issueRelationsStore,
  } = useContextStore();

  return getIssueRows(
    issues,
    'labelIds',
    sort(labels)
      .asc((label) => label.name)
      .map((workflow) => workflow.id),
    showEmptyGroups,
    issuesStore,
    issueRelationsStore,
    true,
  );
};
